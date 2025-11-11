process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("🔄 Connecting to database...");
    await connectDB();
    console.log("✅ Database connection established.");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (e) {
    console.error("❌ Failed to start server:", e.message);
    process.exit(1);
  }
};

startServer();
