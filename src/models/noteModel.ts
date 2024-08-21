import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './userModel';

export interface INote extends Document {
    title: string;
    body: string;
    user: IUser['_id']; //reference to creator
    sentiment: {
        level: string;
        text: string;
        'score tag': string;
        agreement: string;
        confidence: string;
    }[];
}

const noteSchema: Schema<INote> = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        sentiment: {
            type: [{
                level: { type: String },
                text: { type: String },
                "score tag": { type: String },
                agreement: { type: String },
                confidence: { type: String },
            }],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const Note = mongoose.model<INote>('Note', noteSchema);

export default Note;
