import mongoose from 'mongoose';
import { ISize } from '~/interface/models';
const Size = new mongoose.Schema({
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

const Sizes = mongoose.model<ISize>('Size', Size);
export default Sizes;
