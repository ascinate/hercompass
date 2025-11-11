// src/app.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(
  session({
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false,
      maxAge: 24 * 60 * 60 * 1000,
     },
  })
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

app.get("/dashboard", (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect("/login");
  }

  res.render("admin/dashboard", {
    title: "Dashboard",
    user,
  });
});

app.get("/admins", (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect("/login");
  }

  res.render("admin/admins", {
    title: "Admins",
    user, // pass to EJS
  });
});

app.get("/users", (req, res) => {
  const user = req.session.user;

  if (!user) {
    return res.redirect("/login");
  }

  res.render("admin/users", {
    title: "Users",
    user, // pass to EJS
  });
});

app.get("/add-user", (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect("/login");

  res.render("admin/add-user", {
    title: "Add User",
    user,
  });
});


app.use("/api/users", userRoutes);

export default app;
