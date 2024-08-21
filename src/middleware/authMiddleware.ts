import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

interface AuthRequest extends Request {
    user?: any;
}

//this will be used to protect routes with authentication
const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            //checks the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
            //we want to add the user to the request object
            req.user = await User.findById(decoded.id).select('-password');
            //you can go to the next middleware (in our case the controller)
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export default authMiddleware;
