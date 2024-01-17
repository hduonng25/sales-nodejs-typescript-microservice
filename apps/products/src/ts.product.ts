import createApp, { setKeyVerify } from 'app';
import { config } from './config';
import { connectMongo } from './database';
import { router } from './router';
import logger from 'logger';

function main(): void {
    const app = createApp(router, config);
    const port = Number(config.app.port);
    const host = config.app.host;
    setKeyVerify(config.keys.public);
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
