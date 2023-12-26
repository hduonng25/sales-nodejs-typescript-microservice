import mongoose from 'mongoose';
import { IProduct } from '~/interface/models';

const Product = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },

    created_date: {
        type: Date,
        default: Date.now,
    },

    created_by: {
        type: String,
        required: false,
    },

    is_deleted: {
        type: Boolean,
        required: false,
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
            },

            created_date: {
                type: Date,
                default: Date.now,
            },

            quantity: {
                type: Number,
                required: false,
            },

            size: {
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
        },
    ],
});

const Products = mongoose.model<IProduct>('Product', Product);
export default Products;
