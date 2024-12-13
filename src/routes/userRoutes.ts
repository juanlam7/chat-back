import express from 'express';
import { getUsersForSidebar } from '../controllers/userController';
import protectRoute from '../middlewares/protectRoute';

const router = express.Router();

router.get('/', protectRoute, (req, res) => {
  getUsersForSidebar(req, res);
});

export default router;
