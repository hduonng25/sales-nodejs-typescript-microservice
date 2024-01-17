import Joi from 'joi';

export const createColorSchema = Joi.object({
    name: Joi.string().required(),
    code: Joi.string().required(),
}).unknown(true);
