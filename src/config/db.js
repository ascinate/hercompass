// src/config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // 🔥 This line tells Sequelize to accept self-signed certs
    },
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("🗄️ PostgreSQL connected successfully via Sequelize (SSL enabled)");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

export default sequelize;
