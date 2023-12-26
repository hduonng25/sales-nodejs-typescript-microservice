import axios from 'axios';
import logger from 'logger';
import { getCorrelationId } from '../hook';
import { systemInfo } from '../middlewares/result';

//TODO: interface App configs
export interface AppConfigurations {
    environment: string;
    service: string;
    log: {
        logFileEnabled?: string;
        folderLogsPath?: string;

        logstashEnabled?: string;
        logstashHost?: string;
        logstashPort?: string;
        logstashProtocol?: string;
    };
    redis?: {
        host: string;
        port: string;
        username?: string;
        password?: string;
    };
    mongo?: {
        getUri: () => string;
    };
}

//TODO: configs logger
export function configLogger(configs: AppConfigurations): void {
    logger.config({
        service: configs.service,
        ...configs.log,
    });
}

//TODO: config axios
export function configAxios(configs: AppConfigurations): void {
    const service = configs.service;
    const { hostName, netName } = systemInfo();
    axios.defaults.headers['x-forwarded-for'] = service;
    axios.defaults.headers['x-forwarded-for-hostname'] = hostName;
    axios.defaults.headers['x-forwarded-for-netname'] = netName;
    axios.interceptors.request.use((config) => {
        const correlationId = getCorrelationId();
        config.headers['x-correlation-id'] = correlationId;
        return config;
    });
}
