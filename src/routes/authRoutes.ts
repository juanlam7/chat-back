import express from 'express';
import { signup } from '../controllers/authController';
import { login } from '../controllers/authController';
import { logout } from '../controllers/authController';

const router = express.Router();

router.post('/signup', (req, res) => {
  signup(req, res);
});

router.post('/login', (req, res) => {
  login(req, res);
});

router.post('/logout', (req, res) => {
  logout(req, res);
});

export default router;