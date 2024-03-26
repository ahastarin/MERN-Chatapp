import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } from '../controllers/chatController.js';

const router = express.Router();

router.post("/", protect, accessChat)
router.get("/", protect, fetchChats)

router.post('/group', protect, createGroupChat);
router.put('/rename', protect, renameGroup);
router.put('/groupAdd', protect, addToGroup)
router.put('/groupRemove', protect, removeFromGroup);

export default router;