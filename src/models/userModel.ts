import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password: string;
    subscriptions: mongoose.Types.ObjectId[]; //ref to subscriptions
}

const userSchema: Schema<IUser> = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        subscriptions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;
