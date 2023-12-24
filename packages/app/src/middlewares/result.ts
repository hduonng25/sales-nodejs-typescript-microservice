import { NextFunction, Request, Response } from 'express';
import logger from 'logger';
import * as os from 'os';
import { Any } from 'utils';
import { AppConfigurations } from '../configs';
import { HttpStatus } from '../constant/status';
import errorList, { ErrorData, HttpError } from '../error';
import { mask } from '../mask';
import { Result, ResultError, ResultSuccess, error } from '../result';
import { Middleware } from './common';

//TODO: middleware xu ly respone tra ve phia client
//tra ve du lieu chuan voi body, status code tuong ung
export function systemInfo() {
    const hostName = os.hostname();
    const nets = os.networkInterfaces();
    let netName = '';
    Object.entries(nets).forEach(([key, value]) => {
        if (key !== 'lo' && value) {
            let ip = '';
            for (let v of value) {
                if (v.family === 'IPv4') {
                    ip += v.cidr;
                    break;
                }
            }
            netName += `[${key}-${ip}]`;
        }
    });
    return { hostName, netName };
}
export default (env?: string, appConfigs?: AppConfigurations): Middleware => {
    const func = (result: Result | Error, request: Request, response: Response, _: NextFunction): void => {
        let data: ResultError | ResultSuccess;
        if (result instanceof SyntaxError) {
            data = error.syntax(result);
        } else if (result instanceof HttpError) {
            data = result.error;
        } else if (result instanceof Error) {
            logger.error('%O', result);
            data = error.exception(result);
        } else {
            data = result;
        }
        handleResult(data, request, response, env, appConfigs);
    };
    return func as NextFunction;
};

//TODO: chuan hoa du lieu tra ve phia client, mask cac truong nhay cam trong data nhu mat khau,..., them cac thong tin ve thoi gian xu ly
function handleResult(
    data: Result,
    request: Request,
    response: Response,
    env?: string,
    appConfigs?: AppConfigurations,
): void {
    const environment = env || 'dev';
    const statusCode = data.status ?? HttpStatus.BAD_REQUEST;
    let responseData: Any;

    if (data.status > 300) {
        let resultError = data as ResultError;
        if (environment === 'pro' && resultError.status === HttpStatus.METHOD_NOT_ALLOWED) {
            resultError = error.urlNotFound(request.path);
        }
        let { lang } = request.headers;
        lang = lang ?? 'vi';
        const errorCode = resultError.code ?? 'UNKNOWN_ERROR';
        const err = errorList.find((value: ErrorData) => value.errorCode === errorCode);
        let description: string | undefined = undefined;
        if (resultError.description?.vi && lang === 'vi') {
            description = resultError.description.vi;
        }
        if (resultError.description?.en && lang === 'en') {
            description = resultError.description.en;
        }
        if (!description && err && err.description) {
            if (err.description.vi && lang === 'vi') {
                description = err.description.vi;
            }
            if (err.description.en && lang === 'en') {
                description = err.description.en;
            }
        }
        responseData = {
            code: errorCode,
            description: description,
            details: resultError.details,
        };
        if (environment === 'dev') {
            responseData['errors'] = resultError.errors;
        }
    } else {
        const resultSuccess = data as ResultSuccess;
        responseData = resultSuccess.data;
    }
    if (responseData !== null && responseData !== undefined) {
        if (typeof responseData.toJSON === 'function') {
            responseData = responseData.toJSON();
        }
    }
    const maskedResponseData = { ...responseData };
    mask(maskedResponseData, ['password', 'accessToken', 'refreshToken']);
    const correlationId = request.correlation_id;
    const request_id = request.request_id;
    const sourceHostName = request.source_hostname;
    const sourceNetName = request.source_netname;
    const requested_time = request.requested_time || 0;
    const response_time = new Date().getTime();
    const processing_time = response_time - requested_time;
    const requestBody = JSON.parse(JSON.stringify(request.body));
    mask(requestBody, ['password', 'accessToken', 'refreshToken']);
    const sourceService = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    const url = request.url;
    const destService = appConfigs?.service;
    logResponse(request_id, statusCode, maskedResponseData, correlationId);
    response.status(statusCode).json(responseData);
}

const logResponse = (request_id: string, status_code: HttpStatus, body: Any, correlation_id?: string): void => {
    const response_time = new Date();
    const data = {
        request_id,
        correlation_id,
        response_time,
        status_code,
        body,
    };
    logger.info(JSON.stringify(data), { tags: ['response'] });
};

//TODO: kiem tra xem co router nao xu ly request khong, neu khong tra ra loi URL_NOT_FOUND
export const notFoundMiddlewares = (req: Request, _: Response, next: NextFunction): void => {
    const requestedUrl = `${req.protocol}://${req.get('Host')}${req.url}`;
    const error = {
        status: HttpStatus.NOT_FOUND,
        code: 'URL_NOT_FOUND',
        errors: [
            {
                method: req.method,
                url: requestedUrl,
            },
        ],
    };
    if (!req.route) {
        next(error);
    }
    next();
};
