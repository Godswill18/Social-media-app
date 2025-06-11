import express from 'express';
const router = express.Router();
import { login, logout, signup, getMe } from '../controllers/authControllers.js';
import { protectRoute } from '../middleware/protectRoute.js';

router.get("/me", protectRoute, getMe);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;