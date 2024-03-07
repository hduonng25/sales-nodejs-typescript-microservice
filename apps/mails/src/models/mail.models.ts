import mongoose from 'mongoose';
import { IMails } from '../interface/models';

const TemplatesMail = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },

    subject: {
        type: String,
        require: false,
    },

    text: {
        type: String,
        required: false,
    },

    content: {
        type: String,
        required: false,
    },

    create_time: {
        type: Date,
        require: false,
    },

    create_by: {
        type: String,
        require: false,
    },
});

const TemplatesMails = mongoose.model<IMails>(
    'Mails',
    TemplatesMail,
);

export default TemplatesMails;
