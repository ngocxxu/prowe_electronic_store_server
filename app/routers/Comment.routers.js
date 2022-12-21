import express from 'express';
import {
  removeToComment,
  updateToComment,
  addToComment,
  getComment,
} from '../controllers/Comment.controllers.js';

const router = express.Router();

router.get('/:id', getComment);

router.post('/:id', addToComment);

router.put('/:id', updateToComment);

router.delete('/:id', removeToComment);

export default router;
