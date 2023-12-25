import mongoose from 'mongoose';
import { IUser } from '~/interface/model';

const User = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: String,
    },

    adress: {
        type: String,
        require: false,
    },

    phone: {
        type: String,
        required: false,
    },

    email: {
        type: String,
        required: false,
    },

    password: {
        type: String,
        required: false,
    },

    type: {
        type: Boolean,
        required: false,
    },

    role: {
        type: String,
        require: false,
    },

    is_deleted: {
        type: Boolean,
        required: false,
    },
});

//TODO: tao moi Schema User
const Users = mongoose.model<IUser>('User', User);
export default Users;
