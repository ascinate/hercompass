// src/models/User.js
import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    role: {
      type: DataTypes.STRING,
      defaultValue: "user",
    },
    diet_preferences: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    linked_user: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    partner_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    diet_style: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fitness_level: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    moods: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    goals: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    partner_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    partner_consent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    timestamps: false,
  }
);

User.belongsTo(User, { as: "partner", foreignKey: "partner_id" });

export default User;
