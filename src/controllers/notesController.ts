import { Request, Response } from 'express';
import Note from '../models/noteModel';
import User, { IUser } from '../models/userModel';
import mongoose from 'mongoose';
import analyzeSentiment from '../utils/analyzeSentiment'; 
import { io } from '../index'; 

const createNote = async (req: Request, res: Response) => {
  try {
    const { title,body } = req.body;
    const userId = (req as Request & { user: any }).user._id;

    //generate the sentiment analysis
    const sentimentAnalysis = await analyzeSentiment(body);

    const note = new Note({
      title,
      body,
      user: userId,
      sentiment: sentimentAnalysis, 
    });
   
    //get subscribers, search for users that have the creator in their subscriptions
    const subscribers = await User.find({ subscriptions: userId });
  
    //notify subscribers
    subscribers.forEach((subscriber:any) => {
      io.to(subscriber._id.toString()).emit('noteAdded', note);
    });

    
    await note.save();
    res.status(201).json(note);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

//return all notes created by the user and the notes created by the users that the user is subscribed to
const getNotes = async (req: Request, res: Response) => {
    try {
        
        const userId = (req as Request & { user: any }).user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const subscriptions = user.subscriptions;
        //the $or means it will return documents that match at least one of the conditions
        const notes = await Note.find({ $or: [{ user: userId }, { user: { $in: subscriptions } }] });

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//get note only if the user is the creator or is subscribed to the creator
const getNoteById = async (req: Request, res: Response) => {
    try {
        //validate note
        const noteId = req.params.id; 
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        const note = await Note.findById(noteId);
        if (!note || !note.user) {
            return res.status(404).json({ message: 'Note not found' });
        }

        //validate user
        const userId : mongoose.Types.ObjectId= (req as Request & { user: any }).user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const subscriptions = user.subscriptions;
        const notesUser=new mongoose.Types.ObjectId(note.user.toString());

        //check if note of owenr or note of a subscription 
        if (
            note.user.toString() !== userId.toString() &&
            !subscriptions.includes(notesUser)
        ) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
const listUsers = async (req: Request, res: Response) => {
    try {
        //we wont show you the passwords ;)
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const subscribeToUser = async (req: Request, res: Response) => {
    //validate user
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        return res.status(404).json({ message: 'User not found' });
    }
      const userId = new mongoose.Types.ObjectId(req.params.userId);
    try {
        //get the user that wants to subscribe
        const user = await User.findById((req as Request & { user: any }).user._id);
        //get user to subscribe
        const userToSubscribe = await User.findById(userId);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }       
        if (!userToSubscribe) {
            return res.status(404).json({ message: 'User not found' });
        }

        //add if not already subscribed
        if (!user.subscriptions.includes(userId)) {
            user.subscriptions.push(userId);
            await user.save();
        }

        res.status(200).json({ message: `Subscribed to ${userToSubscribe.username}` });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


export { createNote, getNotes, getNoteById, listUsers, subscribeToUser };
