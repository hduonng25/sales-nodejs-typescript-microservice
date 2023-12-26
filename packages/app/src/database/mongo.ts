import logger from 'logger';
import mongoose, { ConnectOptions } from 'mongoose';
import { AppConfigurations } from '../configs';

let uriConnectMongo = '';
export const setUriConnectMongo = (
    configs: AppConfigurations,
): void => {
    uriConnectMongo = configs.mongo?.getUri() as string;
};

export function connectMongo(onSuccess: () => void): void {
    const connectionUri = uriConnectMongo;
    mongoose.set('strictQuery', false);
    mongoose
        .connect(connectionUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions)
        .then(() => {
            logger.info('Connected to mongo');
            onSuccess();
        })
        .catch((err) => {
            logger.error('%O', err);
        });
}

export function connectedToMongo(): boolean {
    return mongoose.connection.readyState === 1;
}
