import logger from 'logger';
import mongoose, { ConnectOptions } from 'mongoose';
import { config } from '~/configs';

export function connectMongo(onSuccess: () => void): void {
    const connectUri = config.mongo.getUri();
    mongoose.set('strictQuery', false);
    mongoose
        .connect(connectUri, {} as ConnectOptions)
        .then(() => {
            logger.info('Connect to mongo successfuly');
            onSuccess();
        })
        .catch((e) => {
            logger.error('%0', e);
        });
}

export function connectedToMongo(): boolean {
    return mongoose.connection.readyState === 1;
}
