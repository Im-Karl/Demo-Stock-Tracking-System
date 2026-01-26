const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");

const authRoutes = require("./routes/auth.routes");
const blogRoutes = require("./routes/blog.routes");
// const newsRoutes = require("./routes/news.routes");
const userRoutes = require("./routes/user.routes");

const app = express();
const server = http.createServer(app);

const { setupWebSocket } = require("./socket/socketManager");


app.use(cors({
  origin: '*', // Hoặc cụ thể 'http://localhost:4321' để an toàn hơn
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/stock_app_db")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

app.use("/api", authRoutes); 
app.use("/api/blogs", blogRoutes);
// app.use("/api/news", newsRoutes);
app.use("/api/user", userRoutes);

setupWebSocket(server);

const PORT = 3000;
server.listen(PORT, () => console.log(`🚀 API Service running on port ${PORT}`));