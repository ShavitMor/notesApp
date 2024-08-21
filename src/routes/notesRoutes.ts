import express from 'express';
import { createNote, getNotes, getNoteById, listUsers, subscribeToUser } from '../controllers/notesController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/notes', authMiddleware, createNote);
router.get('/notes', authMiddleware, getNotes);
router.get('/notes/:id', authMiddleware, getNoteById);
router.get('/users', authMiddleware, listUsers);
router.post('/subscribe/:userId', authMiddleware, subscribeToUser);

export default router;
