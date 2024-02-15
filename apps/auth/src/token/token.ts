import jsonwebtoken, {
    SignOptions,
    VerifyOptions,
} from 'jsonwebtoken';
import { config } from '../config/config';
import { NextFunction, Request, Response } from 'express';
import sha256 from 'crypto-js/sha256';
import { Payload, error } from 'app';

export function checkToken(
    request: Request,
    response: Response,
    next: NextFunction,
) {
    const { token }: any = request.headers;

    let verifyOptions = {
        algorithm: 'RS256',
    } as VerifyOptions;

    let payload = jsonwebtoken.verify(
        token,
        config.keys.public_key,
        verifyOptions,
    );
    const { type, exp }: any = payload;
    const nowTime = new Date().getTime();
    const checkTime = nowTime - Number(exp) * 1000;

    if (type !== 'ACCESS_TOKEN')
        return next(
            error.baseError({
                location: 'token_expire',
                message: 'Phien dang nhap da het han',
            }),
        );

    if (checkTime > 3600 * 1000)
        return next(
            error.baseError({
                location: 'token_expire',
                message: 'Phien dang nhap da het han',
            }),
        );

    if (!token || token === undefined)
        return next(
            error.baseError({
                location: 'not_found_token',
                message: 'Xin hay dang nhap truoc',
            }),
        );
    return next();
}

export function genAccessToken(payload: Omit<Payload, 'type'>): {
    token: string;
    expireAt: number;
} {
    const timestampInSec = new Date().getTime() / 1000;
    const expireAt = Math.floor(timestampInSec + 60 * 60);
    const signOptions = {
        expiresIn: '1h',
        algorithm: 'RS256',
    } as SignOptions;
    const token = jsonwebtoken.sign(
        { ...payload, type: 'ACCESS_TOKEN' },
        config.keys.private_key,
        signOptions,
    );
    return { token, expireAt };
}

export function genRefreshToken(id: string): {
    token: string;
    expireAt: number;
} {
    const timestampInSec = new Date().getTime() / 1000;
    const expireAt = Math.floor(timestampInSec + 60 * 60);
    const signOptions = {
        expiresIn: '24h',
        algorithm: 'RS256',
    } as SignOptions;
    const token = jsonwebtoken.sign(
        { id, type: 'REFRESH_TOKEN' },
        config.keys.private_key,
        signOptions,
    );
    return { token, expireAt };
}

export function getPayload(token: string): Payload | Error {
    const verifyOptions = {
        algorithm: 'RS256',
    } as VerifyOptions;
    try {
        const publicKey = config.keys.public_key;
        const payload = <Payload>(
            jsonwebtoken.verify(token, publicKey, verifyOptions)
        );
        return payload;
    } catch (error) {
        return error as Error;
    }
}

export function genResetPasswordToken(
    id: string,
    time: Date,
    password?: string,
): string {
    return sha256(password || '' + id + time).toString();
}
