import { boolean, string } from 'joi';
import mongoose from 'mongoose';
import { IProduct } from '../interface/models';

const Product = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },

    created_date: {
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

    price: {
        type: Number,
        required: false,
    },

    name: {
        type: String,
        required: false,
    },

    note: {
        type: String,
        required: false,
    },

    is_active: {
        type: Boolean,
        required: false,
        default: true,
    },

    image: {
        type: String,
        required: false,
    },

    product_details: [
        {
            _id: false,
            id: {
                type: String,
                required: true,
            },

            status: {
                type: Boolean,
                required: false,
            },

            is_deleted: {
                type: Boolean,
                required: false,
                default: false,
            },

            created_date: {
                type: Date,
                required: false,
                default: new Date(),
            },

            quantity: {
                type: Number,
                required: false,
            },

            size: {
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

            color: {
                _id: false,
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
            },

            metarial: {
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

            designs: {
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

            image: [
                {
                    _id: false,
                    id: {
                        type: String,
                        required: true,
                    },
                    name: {
                        type: String,
                        req: false,
                    },
                    status: {
                        type: Boolean,
                        required: false,
                    },
                },
            ],

            is_active: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
    ],
});

const Products = mongoose.model<IProduct>('Product', Product);
export default Products;
