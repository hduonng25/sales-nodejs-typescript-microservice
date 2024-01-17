import createApp from 'app';
import { router } from './routers';
import { config } from './configs';
import { connectMongo } from './database';
import logger from 'logger';

function main(): void {
    const app = createApp(router, config);
    const port = Number(config.app.port);
    const host = config.app.host;
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
