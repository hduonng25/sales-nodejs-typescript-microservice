import createApp from 'app';
import { router } from './routers';
import { config } from './configs';
import { connectMongo } from './database';
import logger from 'logger';

function main(): void {
    const app = createApp(router, config);
    const port = Number(config.app.port);
    const startApp = (): void => {
        app.listen(port, () => {
            logger.info(`Listening on port: ${port}`);
        });
    };

    connectMongo(() => {
        startApp();
    });
}

main();
