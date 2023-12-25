import jsonwebtoken, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { config } from '../config/config';
import { NextFunction, Request, Response } from 'express';
import { error } from 'app';

export function checkToken(request: Request, response: Response, next: NextFunction) {
    const { token }: any = request.headers;

    let verifyOptions = {
        algorithm: 'RS256',
    } as VerifyOptions;

    let payload = jsonwebtoken.verify(token, config.keys.public_key, verifyOptions);
    const { type, exp }: any = payload;
    const nowTime = new Date().getTime();
    const checkTime = nowTime - Number(exp) * 1000;

    if (type !== 'ACCESS_TOKEN')
        return next(error.baseError({ location: 'token_expire', message: 'Phien dang nhap da het han' }));

    if (checkTime > 3600 * 1000)
        return next(error.baseError({ location: 'token_expire', message: 'Phien dang nhap da het han' }));

    if (!token || token === undefined)
        return next(error.baseError({ location: 'not_found_token', message: 'Xin hay dang nhap truoc' }));
    return next();
}

export function genToken(payload: any): { token: String; expireAt: Number } {
    const timeStaps = new Date().getTime() / 1000;
    const expireAt = Math.floor(timeStaps + 60 * 60);
    const signOptions = {
        expiresIn: '1h',
        algorithm: 'RS256',
    } as SignOptions;

    const token = jsonwebtoken.sign({ ...payload, type: 'ACCESS_TOKEN' }, config.keys.private_key, signOptions);
    return { token, expireAt };
}

export function refreshToken(payload: any): { token: String; expireAt: Number } {
    const timeStaps = new Date().getTime() / 1000;
    const expireAt = Math.floor(timeStaps + 60 * 60);
    const signOptions = {
        expiresIn: '1h',
        algorithm: 'RS256',
    } as SignOptions;

    const token = jsonwebtoken.sign({ ...payload, type: 'ACCESS_TOKEN' }, config.keys.private_key, signOptions);
    return { token, expireAt };
}
