import Joi from 'joi';

export const ColorValidator = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Ten khong duoc bo trong',
    }),

    code: Joi.string().required().messages({
        'any.required': 'Ma mau sac khong duoc bo trong',
    }),
}).unknown(true);
