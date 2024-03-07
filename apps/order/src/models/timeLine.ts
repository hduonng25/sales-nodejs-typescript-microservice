import mongoose from 'mongoose';
import { ItimeLine } from '../interface/model';

const timeLine = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },

    user: {
        _id: false,
        id: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: false,
        },
    },

    invoice: {
        _id: false,
        code: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            required: false,
        },
    },

    created_time: {
        type: Date,
        required: false,
        default: new Date(),
    },

    action: {
        type: String,
        required: false,
    },

    type: {
        type: String,
        required: false,
        enum: ['status', 'update'],
    },
});

const TimeLines = mongoose.model<ItimeLine>('TimeLine', timeLine);
export default TimeLines;
