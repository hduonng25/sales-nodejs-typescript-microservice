import { NextFunction, Request, Response } from 'express';
import logger from 'logger';
import { v1 } from 'uuid';
import { mask } from '../mask';
import { setCorrelationId } from '../hook';

//TODO: xu li request truoc khi den mot middleware hoac mot router khac
//tao mot id duy nhat cho moi request bang uuid(), lay ra body cua moi request, dong thoi mask cac truong quan trong nhu mat khau,..
//lay thong tin ve client(IP) va cac header lien quan toi source
//gan them mot so thong tin vao req object de su dung o cac middleware ke tiep
//log ra thong tin request
export const requestInitialization = (
    req: Request,
    _: Response,
    next: NextFunction,
): void => {
    const timeNow = new Date();
    req.request_id = v1();
    const body = JSON.parse(JSON.stringify(req.body));
    mask(body, ['password', 'accessToken', 'refreshToken']);
    const client =
        req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const sourceHostName =
        req.headers['x-forwarded-for-hostname'] || 'unknown';
    const sourceNetName =
        req.headers['x-forwarded-for-netname'] || 'unknown';
    const correlationId = req.headers['x-correlation-id'] || v1();
    req.source_hostname = String(sourceHostName);
    req.source_netname = String(sourceNetName);
    req.correlation_id = String(correlationId);
    req.requested_time = timeNow.getTime();
    setCorrelationId(String(correlationId));
    const data = {
        sourceHostName,
        sourceNetName,
        request_id: req.request_id,
        correlation_id: correlationId,
        request_time: timeNow,
        requester: client,
        method: req.method,
        url: req.url,
        body,
    };

    logger.info(JSON.stringify(data), {
        tags: ['request'],
    });
    next();
};
