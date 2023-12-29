import Joi from 'joi';

export const SizeSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Ten khong duoc bo trong',
    }),
}).unknown(true);
