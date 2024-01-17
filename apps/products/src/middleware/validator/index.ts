import Joi from 'joi';

export * from './color.validator';
export * from './size.validator';
export * from './product.validator';

export const findSchema = Joi.object({
    query: Joi.string().optional().allow(),
    sort: Joi.string().optional().allow(),
    page: Joi.number().integer().min(1).default(1),
    size: Joi.number().integer().min(1).max(50).not(0).default(10),
});
