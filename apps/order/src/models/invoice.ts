import mongoose from 'mongoose';
import { IInvoice } from '~/interface/model';

const date = new Date();

const invoice = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },

    code: {
        type: String,
        required: false,
        default: `HD${date.getFullYear()}${
            date.getMonth() + 1
        }${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`,
    },

    status: {
        type: String,
        enum: [
            'created',
            'confirmed',
            'shipping',
            'completed',
            'voided',
            'unpaid',
            'paid',
        ],
        required: false,
        default: 'created',
    },

    type: {
        type: String,
        enum: ['online', 'offline'],
        required: false,
    },

    email_receiver: {
        type: String,
        required: false,
    },

    phone_receiver: {
        type: Number,
        required: false,
    },

    name_receiver: {
        type: String,
        required: false,
    },

    adress_receiver: {
        type: String,
        require: false,
    },

    discount: {
        _id: false,
        id: {
            type: String,
            required: false,
        },

        name: {
            type: String,
            required: false,
        },
    },

    ship_money: {
        type: Number,
        required: false,
        default: 0,
    },

    reduced_money: {
        type: Number,
        required: false,
        default: 0,
    },

    order_money: {
        type: Number,
        required: false,
        default: 0,
    },

    bill_money: {
        type: Number,
        required: false,
        default: 0,
    },

    details: [
        {
            _id: false,
            id: {
                type: String,
                required: true,
            },

            quantity: {
                type: Number,
                required: false,
            },

            price: {
                type: Number,
                required: false,
            },

            money: {
                type: Number,
                required: false,
            },

            product: {
                _id: false,
                id: {
                    type: String,
                    required: false,
                },

                name: {
                    type: String,
                    required: false,
                },

                color: {
                    type: String,
                    required: false,
                },

                size: {
                    type: String,
                    required: false,
                },

                image: {
                    type: String,
                    required: false,
                },
            },
        },
    ],

    created_time: {
        type: Date,
        required: false,
        default: new Date(),
    },

    created_by: {
        type: String,
        required: false,
    },

    is_deleted: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const Invoices = mongoose.model<IInvoice>('Invoices', invoice);
export default Invoices;
