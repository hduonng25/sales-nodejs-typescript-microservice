import express, { Application, Router } from 'express';
import 'express-async-errors';
import { AppConfigurations, configAxios, configLogger } from './configs';
import { ConfigsRedis, setUriConnectMongo } from './database';
import { notFoundMiddlewares } from './middlewares/result';
import {
    parserMiddlewares,
    requestInitialization,
    resultMiddlewares,
    securityMiddlewares,
    handleValidation,
    validate,
} from './middlewares';

//TODO: khai bao createApp nhan vao router chinh
//TODO: Gọi hàm configLogger và configAxios để cấu hình logging và http client
//TODO: hoi tao app Express roi gan vao cac middleware
//TODO: cau hinh toi redis va mongodb
const createApp = (applicationRouter: Router, configs: AppConfigurations): Application => {
    const env = configs.environment;
    configLogger(configs);
    configAxios(configs);
    const app: Application = express();
    app.use(securityMiddlewares);
    app.use(parserMiddlewares);
    app.use(requestInitialization);
    app.use(applicationRouter);
    app.use(notFoundMiddlewares);
    app.use(resultMiddlewares(env, configs));
    ConfigsRedis(configs);
    setUriConnectMongo(configs);
    return app;
};

//TODO: Export ra các module, constant và tiện ích khác có thể tái sử dụng ở nhiều nơi trong ứng dụng
export default createApp;
export * from './constant';
export * from './error';
export * from './request';
export * from './result';
export * from './database';
export * from './middlewares/role.verification';
export { handleValidation, validate };
