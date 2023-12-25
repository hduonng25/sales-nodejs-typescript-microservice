import mongoose, { ConnectOptions } from 'mongoose';
import { config } from '~/config';

export function connectMongo(onSuccess: () => void): void {
    const connectionUri = config.mongo.getUri();
    mongoose.set('strictQuery', false);
    mongoose
        .connect(connectionUri, {} as ConnectOptions)
        .then(() => {
            console.log('Connected to mongo successfuly');
            onSuccess();
        })
        .catch((err) => {
            console.error('%O', err);
        });
}

export function connectedToMongo(): boolean {
    return mongoose.connection.readyState === 1;
}
