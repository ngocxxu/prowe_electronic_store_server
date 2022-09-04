import express from 'express';
import {
  authenToken,
  getMyUser,
  loginAuth,
  logoutAuth,
  refreshTokenAuth,
  registerAuth,
} from '../controllers/auth.controllers.js';

const router = express.Router();

// router.get('/', getAllUsers);

router.get('/myUser', authenToken, getMyUser);

router.post('/register', registerAuth);

router.post('/login', loginAuth);

router.post('/refreshToken', refreshTokenAuth);

router.post('/logout', logoutAuth);

export default router;
