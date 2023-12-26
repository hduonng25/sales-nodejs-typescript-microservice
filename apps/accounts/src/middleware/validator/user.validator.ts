import joi from 'joi';

const userRole = ['Admin', 'Staff'];

export const createUserSchema = joi
    .object({
        name: joi
            .string()
            .required()
            .messages({
                'any.required': 'Ho ten khong duoc bo trong',
            })
            .regex(/^[a-zA-Z0-9]*$/)
            .messages({
                'any.required':
                    'Ho ten khong duoc chua ky tu dac biet',
            }), //TODO: validate name

        adress: joi
            .string()
            .required()
            .messages({
                'any.required': 'Dia chi khong duoc bo trong',
            })
            .regex(/^[a-zA-Z0-9 ]*$/)
            .messages({
                'any.required':
                    'Dia chi khong duoc chua ky tu dac biet',
            }), //TODO: validate adress

        phone: joi
            .string()
            .length(10)
            .pattern(/^[0-9]+$/)
            .required()
            .messages({
                'string.length': 'So dien thoai phai 10 so',
                'string.pattern.base': 'So dien thoai phai la so',
                'any.required': 'So dien thoai khong hop le',
            }), //TODO: validate phone

        email: joi.string().required().email().messages({
            'string.email': 'Email khong hop le',
            'any.required': 'Khong duoc de trong email',
        }), //TODO: validate email

        password: joi.string().required().messages({
            'any.required': 'Mat khau khong duoc bo trong',
        }),

        role: joi
            .string()
            .required()
            .valid(...userRole)
            .messages({
                'any.required': 'Chuc vu khong duoc bo trong',
                'any.only': 'Chuc vu chi duoc chon Admin hoac Staff',
            }),
    })
    .unknown(true);
