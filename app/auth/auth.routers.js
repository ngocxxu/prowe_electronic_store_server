import express from 'express';
import { createUser, getUser } from '../controllers/User.controllers.js';
import { loginAuth, logoutAuth, refreshTokenAuth } from './auth.controllers.js';

const router = express.Router();

// router.get('/', getAllUsers);

router.get('/id', getUser);

router.post('/login', loginAuth);

router.post('/refreshToken', refreshTokenAuth);

router.post('/logout', logoutAuth);

export default router;
