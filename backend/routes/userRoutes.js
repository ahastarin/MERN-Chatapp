import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { registerUser, authUser, getAllUser } from './../controllers/userController.js';

const router = express.Router()

// authentication
router.post('/', registerUser);
router.post('/login', authUser);

// getAllUser or by name or email
router.get("/", protect, getAllUser)

export default router;