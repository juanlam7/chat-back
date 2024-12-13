import express from 'express';
import { getMessages, sendMessage } from '../controllers/messageController';
import protectRoute from '../middlewares/protectRoute';

const router = express.Router();

router.get('/:id', protectRoute, (req, res) => {
  getMessages(req, res);
});

router.post('/send/:id', protectRoute, (req, res) => {
  sendMessage(req, res);
});

export default router;
