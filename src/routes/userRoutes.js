import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getNormalUsersAndPartners,
  getAdminsAndOthers,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";
import { getUserMetrics } from "../controllers/metricsController.js";


const router = express.Router();

router.get("/", getAllUsers);
// GET single user by ID
router.get("/find/:id", getUserById);
router.get("/regulars", getNormalUsersAndPartners); // for 'user' and 'partner'
router.get("/admins", getAdminsAndOthers);          // for 'admin' and others
router.post("/login", loginUser);
router.get("/logout", logoutUser); // 👈 add this
router.post("/add", createUser);
router.post("/update/:id", updateUser);
router.get("/delete/:id", deleteUser);
router.get("/metrics", getUserMetrics);


export default router;
