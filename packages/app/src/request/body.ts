import { Request } from 'express';
import { matchedData } from 'express-validator';

export function matchedBody<T>(req: Request): T {
    return <T>matchedData(req, { locations: ['body'] });
}
