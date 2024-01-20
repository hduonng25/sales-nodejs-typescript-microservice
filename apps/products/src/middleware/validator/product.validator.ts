import Joi from 'joi';

//TODO: Product shema
const productSchema = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    price: Joi.number().min(1).required(),
    note: Joi.string().optional(),
});

export const createProductSchema = productSchema
    .keys({
        size: Joi.array().items(Joi.string()).optional(),
        color: Joi.array().items(Joi.string()).optional(),
        metarial: Joi.string().required(),
        designs: Joi.string().required(),
        images: Joi.array().items(Joi.string()).optional(),
    })
    .unknown(true);

export const updateProductSchema = productSchema.keys({
    id: Joi.string().required(),
    images: Joi.array().items(Joi.string()).optional(),
});

export const activeProductSchema = Joi.object({
    id: Joi.string().required(),
    is_active: Joi.boolean().required(),
});

export const deleteProductSchema = Joi.object({
    id: Joi.string().required(),
});

export const deleteManyProductChema = Joi.object({
    id: Joi.array().items(Joi.string()).required(),
});
