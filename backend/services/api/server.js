const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const setupDeleteBlogCron = require('./cron/deleteBlog');

const authRoutes = require('./routes/auth.routes');
const blogRoutes = require('./routes/blog.routes');
const userRoutes = require('./routes/user.routes');
const uploadRoutes = require('./routes/upload.routes');
const commentRoutes = require('./routes/comment.routes');
const watchlistRoutes = require('./routes/watchlist.routes');

const setupCheckAlerts = require('./cron/checkAlerts');

const app = express();
const server = http.createServer(app);

const { setupWebSocket } = require('./socket/socketManager');

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());

mongoose
  .connect('mongodb://127.0.0.1:27017/stock_app_db')
  .then(() => {
    console.log(' MongoDB Connected');

    setupDeleteBlogCron();
    setupCheckAlerts();
  })
  .catch((err) => console.error('MongoDB Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

app.use('/api/user', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/watchlist', watchlistRoutes);

setupWebSocket(server);

const PORT = 3000;
server.listen(PORT, () => console.log(`API Service running on port ${PORT}`));
