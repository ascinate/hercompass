// src/routes/dashboardRoutes.js
import express from "express";
import { getUserDashboard } from "../controllers/userDashboardController.js";
const router = express.Router();

router.get("/:id", getUserDashboard); // GET /api/users/dashboard/:id  (use "me" if you have auth)

export default router;
