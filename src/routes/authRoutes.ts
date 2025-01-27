import express from 'express';
import { initApp, login, logout, signup } from '../controllers/authController';

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

router.get('/initiation', (req, res) => {
  initApp(req, res);
});

export default router;
