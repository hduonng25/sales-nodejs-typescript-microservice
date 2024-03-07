import mongoose from 'mongoose';
import { IDesign } from '../interface/models';

const Design = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: false,
    },

    is_deleted: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const Designs = mongoose.model<IDesign>('Design', Design);
export default Designs;
