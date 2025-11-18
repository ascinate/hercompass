import sequelize from "../config/db.js";
import { QueryTypes } from "sequelize";

export const growthDashboard = async(req,res)=>{
     const admin = req.session.admin;

    if (!admin) return res.redirect("/login");

    try {
        const leaderboard = await sequelize.query(
            `
            SELECT 
                u.id,
                u.full_name,
                u.role,

                COUNT(r.id) AS referrals_sent,
                COUNT(CASE WHEN r.status = 'activated' THEN 1 END) AS activated_count,

                COUNT(p.id) AS linked_partners,

                -- Demo CPS
                ROUND(COUNT(r.id) * 2.5) AS cps

            FROM users u
            LEFT JOIN referrals r ON r.inviter_id = u.id
            LEFT JOIN users p ON p.partner_id = u.id

            GROUP BY u.id, u.full_name, u.role
            ORDER BY referrals_sent DESC
            `,
            { type: QueryTypes.SELECT }
        );

        res.render("admin/growth", {
            title: "Growth & Acquisition",
            admin,
            leaderboard
        });

    } catch (err) {
        console.error("Growth Dashboard Error:", err);
        return res.render("admin/growth", {
            title: "Growth & Acquisition",
            admin,
            leaderboard: []
        });
    }         
};