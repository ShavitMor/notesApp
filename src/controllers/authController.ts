import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

const registerUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    //check username and password provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    try {
        //check name already exist
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        //hash and salt the password, no pepper allowed!
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //mongodb automatically saves the id and the date of creation
        const user = new User({
            username,
            password: hashedPassword,
            subscriptions: [],
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            _id: user._id,
            username: user.username
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        //check user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //check password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        //create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
            expiresIn: '24h',
        });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const getUserProfile = async (req: Request, res: Response) => {
    try {
        //get the user without his password
        const user = await User.findById((req as any).user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export { registerUser, loginUser, getUserProfile };
