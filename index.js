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


// ================= CONNECT MONGODB =================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1); // fail luôn nếu lỗi DB
});


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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});