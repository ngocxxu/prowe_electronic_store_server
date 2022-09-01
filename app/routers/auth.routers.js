import express from 'express';
import { loginAuth, logoutAuth, refreshTokenAuth, registerAuth } from '../controllers/auth.controllers.js';

const router = express.Router();

// router.get('/', getAllUsers);

// router.get('/id', getUser);

router.post('/register', registerAuth);

router.post('/login', loginAuth);

router.post('/refreshToken', refreshTokenAuth);

router.post('/logout', logoutAuth);

export default router;
