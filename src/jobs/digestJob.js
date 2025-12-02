// src/jobs/digestJob.js

import { Op } from "sequelize";
import SymptomLog from "../models/SymptomLog.js";
import PredictiveLog from "../models/PredictiveLog.js";
import PartnerShare from "../models/PartnerShare.js";
import DigestLog from "../models/DigestLog.js";
import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import { transporter } from "../utils/mailTransporter.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Build summary for last 7 days
 */
const buildSummaryForUser = async (userId, sharedFields = []) => {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const logs = await SymptomLog.findAll({
    where: {
      user_id: userId,
      log_date: { [Op.gte]: since }
    },
    order: [["log_date", "ASC"]],
  });

  const moods = logs.map(l => Number(l.mood)).filter(Boolean);
  const avgMood = moods.length
    ? (moods.reduce((a, b) => a + b, 0) / moods.length).toFixed(2)
    : null;

  const notes = logs.slice(-3).map(l => l.notes).filter(Boolean);

  const latestPredict = await PredictiveLog.findOne({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
  });

  return {
    period: { from: since.toISOString(), to: new Date().toISOString() },
    avg_mood: avgMood,
    recent_notes: notes,
    predictive_snapshot: latestPredict ? latestPredict.predicted_symptoms : null,
    logs_count: logs.length
  };
};

/**
 * runDigestForUser()
 */
export const runDigestForUser = async (
  userId,
  partnerId,
  sharedFields = [],
  opts = { preview: true }
) => {

  const share = await PartnerShare.findOne({
    where: { user_id: userId, partner_id: partnerId }
  });

  if (!share || !share.consent) {
    throw new Error("No consent for this partner");
  }

  const summary = await buildSummaryForUser(userId, sharedFields);

  const emailHtml = `
    <h3>HerCompass — Weekly Digest</h3>
    <p>Period: ${summary.period.from.slice(0, 10)} → ${summary.period.to.slice(0, 10)}</p>

    ${sharedFields.includes("mood_trend") ? `
      <p><strong>Average Mood:</strong> ${summary.avg_mood ?? "N/A"}</p>` : ""}

    ${sharedFields.includes("notes") && summary.recent_notes?.length ? `
      <p><strong>Recent Note:</strong> "${summary.recent_notes[0]}"</p>` : ""}

    <hr />
    <p><strong>Recommended Actions:</strong></p>
    <ul>
      <li>Maintain consistent sleep routine</li>
      <li>Light afternoon walk improves energy</li>
    </ul>
  `;

  if (opts.preview) {
    return { summary, emailHtml };
  }

  // INSERT digest_log (must include id + sent_at)
  const digestId = uuidv4();
  const digestEntry = await DigestLog.create({
    id: digestId,
    user_id: userId,
    partner_id: partnerId,
    digest_type: "weekly",
    fields_shared: sharedFields,
    sent_at: new Date()
  });

  const partner = await User.findByPk(partnerId);
  if (!partner || !partner.email) {
    throw new Error("Partner email missing");
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: partner.email,
      subject: "HerCompass Weekly Digest",
      html: emailHtml,
    });

    // AUDIT LOG (SUCCESS)
    await AuditLog.create({
      actor_id: userId,
      action: "digest_sent",
      target_table: "digest_logs",
      target_id: digestEntry.id,
      ip_address: "0.0.0.0"
    });

    return { success: true, digestId, info };

  } catch (err) {
    // AUDIT LOG (FAILED)
    await AuditLog.create({
      actor_id: userId,
      action: "digest_send_failed",
      target_table: "digest_logs",
      target_id: digestEntry.id,
      ip_address: "0.0.0.0"
    });

    throw err;
  }
};


/**
 * Weekly cron job
 */
export const runWeeklyDigestForAllUsers = async () => {
  const shares = await PartnerShare.findAll({ where: { consent: true } });

  const results = [];

  for (const s of shares) {
    try {
      const result = await runDigestForUser(
        s.user_id,
        s.partner_id,
        s.shared_fields,
        { preview: false }
      );

      results.push({ share: s.id, ok: true, result });

    } catch (err) {
      results.push({ share: s.id, ok: false, error: err.message });
    }
  }

  return results;
};

export default runDigestForUser;
