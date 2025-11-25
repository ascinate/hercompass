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
    allowNull: false,
  },

  partner_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },

  consent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  shared_fields: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },

  last_shared: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: false,
});

export default PartnerShare;
