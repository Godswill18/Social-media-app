import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'
import connectDB from './DB/connectMongoDB.js';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary';
import cors from 'cors';
import corsOptions from './config/corsOptions.js';
// const session = require('express-session'); // Import express-session for session management

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB(); // Connect to MongoDB using the connectDB function

// app.set('trust proxy', 1) // trust first proxy

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({limit:"5mb"})); // Middleware to parse JSON requests || to parse incoming JSON data  [ Limit shouldn't be too high, as it can lead to performance issues or security vulnerabilities DOS ]
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data || to parse form data(urlencoded)


// pass cookies through here 
app.use(cookieParser());

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes)



mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB...');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}....`));
});
