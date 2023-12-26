import { NextFunction, Request, Response } from 'express';
import {
    ValidationError,
    validationResult,
} from 'express-validator';
import { HttpsStatus } from '../constant/status';
import { ResultError } from '../result';
import { Middleware } from './common';
import { Schema } from 'joi';

//TODO: dung de xe li validate tung cac middleware khac , bao loi validate va tra ve respone loi
const handleValidation: Middleware = (
    req: Request,
    _: Response,
    next: NextFunction,
): void => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const validationErrors = error.array().map((e) => {
            const error: Partial<ValidationError> = e;
            const message = e.msg;
            delete error['msg'];
            return { message, ...error };
        });
        const resultError: ResultError = {
            status: HttpsStatus.BAD_REQUEST,
            errors: validationErrors,
            code: 'INVALID_DATA',
        };
        return next(resultError);
    } else {
        next();
    }
};

//TODO: dung de validate body cua request
const body = (schema: Schema): Middleware => {
    return getRequestHandler('body', schema);
};

//TODO: dung de validate query cua request
const query = (schema: Schema): Middleware => {
    return getRequestHandler('query', schema);
};

//TODO: khoi tao ham middleware validate dua tren viec truyen vao body hay query
function getRequestHandler(
    location: 'body' | 'query',
    schema: Schema,
): Middleware {
    return (req: Request, _: Response, next: NextFunction) => {
        let data: unknown;
        if (location === 'body') {
            data = req.body;
        } else if (location === 'query') {
            data = req.query;
        } else {
            next();
        }
        const result = schema.validate(data, {
            stripUnknown: true,
            abortEarly: false,
        });

        if (result.error) {
            const validationErrors = result.error.details.map(
                (item) => {
                    const param = item.path.join('.');
                    const value = item.context?.value;
                    let message = item.message;
                    message = message.replace(
                        `"${param}"`,
                        `'${param}'`,
                    );
                    return {
                        location,
                        param,
                        value,
                        message,
                    };
                },
            );
            const resultError: ResultError = {
                status: HttpsStatus.BAD_REQUEST,
                errors: validationErrors,
                code: 'INVALID_DATA',
            };
            next(resultError);
        } else {
            if (location === 'body') {
                req.body = result.value;
            } else if (location === 'query') {
                req.query = result.value;
            }
            next();
        }
    };
}

export const validate = { body, query };

export default handleValidation;
