// src/models/User.js
import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // same as gen_random_uuid()
      primaryKey: true,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    full_name: {
      type: DataTypes.TEXT,
    },
    gender: {
      type: DataTypes.ENUM("female", "male", "other"),
    },
    menopause_phase: {
      type: DataTypes.ENUM("peri", "menopause", "post"),
    },
    partner_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users", // table name
        key: "id",
      },
      onDelete: "SET NULL",
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
    last_active: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    logs_count_7d: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    forecast_last_sent: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    forecast_useful_rating: {
      type: DataTypes.DECIMAL(3, 2),
      validate: {
        min: 0,
        max: 5,
      },
    },
    subscription_status: {
      type: DataTypes.ENUM("active", "inactive", "canceled", "trial"),
    },
  },
  {
    tableName: "users",
    timestamps: false, // since you’re using created_at / updated_at manually
  }
);

// Optional: self-association for partner_id
User.belongsTo(User, { as: "partner", foreignKey: "partner_id" });

export default User;
