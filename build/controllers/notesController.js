"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToUser = exports.listUsers = exports.getNoteById = exports.getNotes = exports.createNote = void 0;
const noteModel_1 = __importDefault(require("../models/noteModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, body } = req.body;
    try {
        const note = new noteModel_1.default({
            title,
            body,
            user: req.user._id, // Type assertion
        });
        yield note.save();
        res.status(201).json(note);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.createNote = createNote;
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield noteModel_1.default.find({ user: req.user._id });
        res.status(200).json(notes);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getNotes = getNotes;
const getNoteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteId = req.query.id; // Access ID from query string
        if (!noteId) {
            return res.status(400).json({ message: 'Missing note ID' });
        }
        const note = yield noteModel_1.default.findById(noteId);
        if (!note || !note.user) {
            return res.status(404).json({ message: 'Note not found' });
        }
        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(note);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getNoteById = getNoteById;
const listUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find().select('-password');
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.listUsers = listUsers;
const subscribeToUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = new mongoose_1.default.Types.ObjectId(req.params.userId);
    try {
        const user = yield userModel_1.default.findById(req.user._id);
        const userToSubscribe = yield userModel_1.default.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!userToSubscribe) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Add userId to the subscriptions array if not already subscribed
        if (!user.subscriptions.includes(userId)) {
            user.subscriptions.push(userId);
            yield user.save();
        }
        res.status(200).json({ message: `Subscribed to ${userToSubscribe.username}` });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.subscribeToUser = subscribeToUser;
