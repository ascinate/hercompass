// src/models/PartnerShare.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PartnerShare = sequelize.define("partner_shares", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  partner_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  consent: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  shared_fields: {
     type: DataTypes.JSONB,
     defaultValue: {},
  },
  last_shared: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
});

export default PartnerShare;
