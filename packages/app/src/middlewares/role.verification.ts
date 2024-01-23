import { NextFunction, Request, RequestHandler, Response } from 'express';
import jsonwebtoken, { VerifyOptions } from 'jsonwebtoken';
import { HttpsStatus } from '../constant';
import { HttpError } from '../error';
import { Payload } from '../request';
import { ErrorDetail, error } from '../result';

//TODO: middleware xac thuc va kiem tra quyen trong express
export function verifyRole(...roles: string[]): RequestHandler {
    if (roles.includes('*')) {
        roles.push('ADMIN', 'STAFF');
    }

    return (req: Request, _: Response, next: NextFunction) => {
        const errorResult = error.actionNotAllowed();
        if (!req.payload) {
            return next(errorResult);
        }

        const { roles: userRoles } = req.payload;
        const isRoleOke = userRoles.some((r) => {
            return roles.includes(r);
        });
        if (isRoleOke) {
            return next();
        }
        return next(errorResult);
    };
}

let keypublic = '';
export const setKeyVerify = (key: string): void => {
    keypublic = key;
};

//TODO: lay token tu header cua request, kiem tra xem hop le hay khong, neu khong tra ve loi 401
//TODO: decode ra payload trong token roi them vao trong request de cac middleware va router tiep theo su dung
export async function verifyToken(
    req: Request,
    _: Response,
    next: NextFunction,
): Promise<void> {
    const option = {
        algorithm: 'RS256',
    } as VerifyOptions;
    const token: string | undefined = req.header('token');
    const errors: ErrorDetail[] = [
        {
            param: 'token',
            location: 'header',
        },
    ];
    if (!token) {
        throw new HttpError({
            status: HttpsStatus.UNAUTHORIZED,
            code: 'NO_TOKEN',
            errors: errors,
        });
    }

    try {
        const publicKey = keypublic;
        const payload = <Payload>jsonwebtoken.verify(token, publicKey, option);
        req.payload = payload;
        if (payload.type !== 'ACCESS_TOKEN') {
            return next({
                status: HttpsStatus.UNAUTHORIZED,
                code: 'INVALID_TOKEN',
                errors: errors,
            });
        }
        return next();
    } catch (error) {
        const e: Error = error as Error;
        if (e.name && e.name === 'TokenExpiredError') {
            return next({
                status: HttpsStatus.UNAUTHORIZED,
                code: 'TOKEN_EXPIRED',
                errors: errors,
            });
        } else {
            return next({
                status: HttpsStatus.UNAUTHORIZED,
                code: 'INVALID_TOKEN',
                errors: errors,
            });
        }
    }
}
