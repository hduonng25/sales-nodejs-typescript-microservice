import createApp, { setKeyVerify } from 'app';
import { router } from './router';
import { configs } from './config';
import logger from 'logger';
import { connectMongo } from './database';

function main(): void {
    const app = createApp(router, configs);
    const port = Number(configs.app.port);
    const host = configs.app.host;
    setKeyVerify(configs.keys.public);
    const startApp = (): void => {
        app.listen(Number(port), host, () => {
            logger.info('Listening on: %s:%d', host, port);
        });
    };

    connectMongo(() => {
        startApp();
    });
}

main();
