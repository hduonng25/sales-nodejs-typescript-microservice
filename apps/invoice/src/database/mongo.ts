import logger from 'logger';
import mongoose, { ConnectOptions } from 'mongoose';
import { configs } from '~/config';

export function connectMongo(onSuccess: () => void): void {
    const connectUri = configs.mongo.getUri();

    mongoose.set('strictQuery', false);
    mongoose
        .connect(connectUri, {} as ConnectOptions)
        .then(() => {
            logger.info('Connect to mongodb successfuly');
            onSuccess();
        })
        .catch((e) => {
            logger.error('%0', e);
        });
}

export function connectedToMongo(): boolean {
    return mongoose.connection.readyState === 1;
}
