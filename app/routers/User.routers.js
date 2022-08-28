import express from 'express';
import { createUser, getAllUsers, getUser } from '../controllers/User.controllers.js';

const router = express.Router();

router.get('/', getAllUsers);

router.get('/id', getUser);

router.post('/', createUser);

export default router;
