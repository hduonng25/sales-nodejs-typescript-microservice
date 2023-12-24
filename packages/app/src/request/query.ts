import { Request } from 'express';
import { matchedData } from 'express-validator';

export function matchedQuery<T>(req: Request): T {
    return <T>matchedData(req, { locations: ['query'] });
}
