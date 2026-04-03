const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
require("dotenv").config();
const setupDeleteBlogCron = require("./cron/deleteBlog");

const authRoutes = require("./routes/auth.routes");
const blogRoutes = require("./routes/blog.routes");
const userRoutes = require("./routes/user.routes");
const uploadRoutes = require("./routes/upload.routes");

const app = express();
const server = http.createServer(app);

const { setupWebSocket } = require("./socket/socketManager");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/stock_app_db")
  .then(() => {
    console.log(" MongoDB Connected");

    setupDeleteBlogCron();
  })
  .catch((err) => console.error("MongoDB Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.use("/api/user", userRoutes);
app.use("/api/upload", uploadRoutes);

setupWebSocket(server);

const PORT = 3000;
server.listen(PORT, () => console.log(`API Service running on port ${PORT}`));
