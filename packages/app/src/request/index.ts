export interface Payload {
    id: string;
    roles: string[];
    name: string;
    type: string;
    email: string;
}

declare module 'express-serve-static-core' {
    export interface Request {
        payload?: Payload;
        request_id: string;
        correlation_id?: string;
        requested_time?: number;
        source_hostname?: string;
        source_netname?: string;
    }
}

export {};

export * from './body';
export * from './query';
