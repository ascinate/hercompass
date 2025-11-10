import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false, // disable SQL logs in console

  dialectOptions: {
    ssl: {
      require: true, // Supabase requires SSL
      rejectUnauthorized: false, // allow self-signed certs
    },
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully via Sequelize");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

export default sequelize;
