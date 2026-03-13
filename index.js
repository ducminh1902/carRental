// Load .env (optional - cần cài: npm i dotenv)
try { require('dotenv').config(); } catch (_) {}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

const corsOptions = require("./config/cors");
const bookingRoutes = require("./routes/bookingRoutes");
const carRoutes = require("./routes/carRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(corsOptions);           // CORS với cấu hình credentials, origins
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// View engine setup - EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB connection
mongoose.connect("mongodb+srv://MinhLD:ikCbA1o8rPVBKM3y@carrental.8aaqo3g.mongodb.net/carRental")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Trang Chủ", token: req.query.token || null });
});

// authentication routes (register & login)
app.use("/auth", authRoutes);

// protected resource routes
app.use("/bookings", bookingRoutes);
app.use("/cars", carRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
