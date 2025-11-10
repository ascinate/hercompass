// src/controllers/userController.js
import User from "../models/User.js";
import { Op } from "sequelize";


// 🟢 Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

// controllers/userController.js
export const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    // Fetch the entire user record
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Return everything
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔥 Plain password comparison (no bcrypt, no nonsense)
    if (user.password.trim() !== password.trim()) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    req.session.user = {
      id: user.id,
      name: user.full_name,
      role: user.role,
      email: user.email,
    };

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};


// 🔴 Logout user and redirect to login
export const logoutUser = async (req, res) => {
  try {
    if (req.session && req.session.user) {
      const userId = req.session.user.id;

      // 🕒 Update last_active time in DB
      await User.update(
        { last_active: new Date() },
        { where: { id: userId } }
      );

      // 🔒 Destroy session
      req.session.destroy((err) => {
        if (err) {
          console.error("❌ Session destroy error:", err);
        }
      });
    }

    // Redirect to login page
    return res.redirect("/login");
  } catch (error) {
    console.error("❌ Logout error:", error.message);
    return res.status(500).send("Error during logout");
  }
};

// 🟢 Get users with role = 'user' or 'partner'
export const getNormalUsersAndPartners = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: ["user", "partner"],
      },
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("❌ Error fetching normal users and partners:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching normal users and partners",
    });
  }
};

// 🟢 Get admins and other roles (excluding 'user' & 'partner')
export const getAdminsAndOthers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        role: {
          [Op.notIn]: ["user", "partner"],
        },
      },
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("❌ Error fetching admin/other users:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching admin/other users",
    });
  }
};
// Additional controller functions (createUser, updateUser, deleteUser) can be added here as needed.


export const createUser = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      gender,
      role = "user",
      menopause_phase,
      partner_id,
      subscription_status,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    // 👇 Only hash if NOT admin
    const finalPassword =
      role === "admin" ? password : await bcrypt.hash(password, 10);

    const newUser = await User.create({
      full_name,
      email,
      password: finalPassword,
      gender,
      role,
      menopause_phase,
      partner_id,
      subscription_status,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    res.status(500).json({
      success: false,
      message: "Server error while creating user",
    });
  }
};
// 🟢 Update user details
// 🟢 Update an existing user
export const updateUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const {
      full_name,
      email,
      password,
      gender,
      role,
      menopause_phase,
      partner_id,
      subscription_status,
    } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.update({
      full_name: full_name ?? user.full_name,
      email: email ?? user.email,
      password: password ?? user.password,
      gender: gender ?? user.gender,
      role: role ?? user.role,
      menopause_phase: menopause_phase ?? user.menopause_phase,
      partner_id: partner_id ?? user.partner_id,
      subscription_status: subscription_status ?? user.subscription_status,
      updated_at: new Date(),
    });

    res.status(200).json({ success: true, message: "User updated successfully", user });
  } catch (err) {
    console.error("❌ Error updating user:", err.message);
    res.status(500).json({ success: false, message: "Server error while updating user" });
  }
};
// 🟢 Delete a user
// 🔴 Delete a user
export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.destroy();

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err.message);
    res.status(500).json({ success: false, message: "Server error while deleting user" });
  }
};
