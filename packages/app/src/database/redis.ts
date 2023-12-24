import { Redis } from 'ioredis';
import logger from 'logger';
import { AppConfigurations } from '../configs';
export let redis: Redis;

export function ConfigsRedis(configs: AppConfigurations): Redis {
    redis = new Redis({
        host: configs.redis?.host,
        port: Number(configs.redis?.port),
        username: configs.redis?.username,
        password: configs.redis?.password,
        lazyConnect: true,
        retryStrategy: function (times): number | void | null {
            if (times % 5 === 0) {
                return null;
            }
            return 5 * 1000;
        },
    });
    return redis;
}
export function connectRedis(onSuccess: () => void): void {
    redis
        .connect()
        .then(() => {
            logger.info('Connected to redis');
            onSuccess();
        })
        .catch((reason) => {
            logger.error('%O', reason);
        });
}

export function connectedToRedis(): boolean {
    return redis.status === 'ready';
}
