import createApp from 'app';
import logger from 'logger';
import { router } from './routers';
import { configs } from './configs';

function main(): void {
    const app = createApp(router, configs);
    const host = configs.app.host;
    const port = configs.app.port;
    const startApp = (): void => {
        app.listen(Number(port), host, () => {
            logger.info('Listening on: %s:%d', host, port);
        });
    };
    startApp();
}

main();
