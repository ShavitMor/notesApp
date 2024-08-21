"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notesController_1 = require("../controllers/notesController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.post('/notes', authMiddleware_1.default, notesController_1.createNote);
router.get('/notes', authMiddleware_1.default, notesController_1.getNotes);
router.get('/notes/:id', authMiddleware_1.default, notesController_1.getNoteById);
router.get('/users', authMiddleware_1.default, notesController_1.listUsers);
router.post('/subscribe/:userId', authMiddleware_1.default, notesController_1.subscribeToUser);
exports.default = router;
