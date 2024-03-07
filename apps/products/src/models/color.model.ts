import mongoose from 'mongoose';
import { IColor } from '../interface/models';

const Color = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: false,
    },

    code: {
        type: String,
        required: false,
    },

    is_deleted: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const Colors = mongoose.model<IColor>('Color', Color);
export default Colors;
