import logger from 'logger';
import mongoose, { ConnectOptions } from 'mongoose';
import { config } from '~/config';

export function connectMongo(onSuccess: () => void): void {
    const connectionUri = config.mongo.getUri();
    mongoose.set('strictQuery', false);
    mongoose
        .connect(connectionUri, {} as ConnectOptions)
        .then(() => {
            logger.info('Connected to mongo successfuly');
            onSuccess();
        })
        .catch((err) => {
            logger.error('%O', err);
        });
}

export function connectedToMongo(): boolean {
    return mongoose.connection.readyState === 1;
}
