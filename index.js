// Load biến môi trường (.env nếu chạy local)
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


// ================= MIDDLEWARE =================
app.use(corsOptions); 
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ================= STATIC FILE =================
app.use(express.static(path.join(__dirname, "public")));


// ================= VIEW ENGINE =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// ================= ROUTES =================
app.get("/", (req, res) => {
  res.render("index", { 
    title: "Trang Chủ", 
    token: req.query.token || null 
  });
});

// auth
app.use("/auth", authRoutes);

// protected routes
app.use("/bookings", bookingRoutes);
app.use("/cars", carRoutes);


// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/carRental";

mongoose.connect(mongoUri)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });