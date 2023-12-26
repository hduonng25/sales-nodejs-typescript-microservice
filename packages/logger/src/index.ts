import winston, { LoggerOptions } from 'winston';
import { LoggerConfigurations } from './configs';
import Transport from 'winston-transport';
import 'winston-daily-rotate-file';
import { LogstashTransport } from './transport';

function getTransports(configs?: LoggerConfigurations): Transport[] {
    const fileEnabled =
        configs?.logFileEnabled === 'true' ? true : false;
    const logstashEnabled =
        configs?.logstashEnabled === 'true' ? true : false;
    const logsPath = configs?.folderLogsPath || 'logs';
    const options = {
        file: {
            level: 'info',
            datePattern: 'YYYY-MM-DD-HH',
            filename: `${logsPath}/app-%DATE%.log`,
            handleExceptions: true,
            maxFiles: '14d',
            colorize: true,
            maxSize: '20m',
            json: true,
        },
        console: {
            level: 'debug',
            handleExceptions: true,
            colorize: true,
            json: false,
        },
    };

    const transports: Transport[] = [
        new winston.transports.Console(options.console),
    ];
    if (fileEnabled) {
        const transport = new winston.transports.DailyRotateFile(
            options.file,
        );
        transports.push(transport);
    }
    if (logstashEnabled) {
        const logstashHost = configs?.logstashHost;
        const logstashPort = configs?.logstashPort;
        const logstashProtocol = configs?.logstashProtocol;

        if (!logstashHost) {
            throw new Error('');
        }
        if (!logstashPort && !Number.isInteger(logstashPort)) {
            throw new Error('');
        }
        if (
            !logstashProtocol &&
            logstashProtocol != 'udp' &&
            logstashProtocol != 'tcp'
        ) {
            throw new Error('');
        }
        const transport = new LogstashTransport({
            level: 'info',
            host: logstashHost,
            port: Number(logstashPort),
            protocol: logstashProtocol as 'udp' | 'tcp',
            handleExceptions: true,
            service: configs.service,
        });
        transports.push(transport);
    }
    return transports;
}

function getOptions(configs?: LoggerConfigurations): LoggerOptions {
    const service = `[service:${configs?.service}]` ?? '';
    return {
        format: winston.format.combine(
            winston.format.splat(),
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss.SSS',
            }),
            winston.format.printf(
                (info: winston.Logform.TransformableInfo) => {
                    let tags = '';
                    if (info.tags && Array.isArray(info.tags)) {
                        tags = info.tags
                            .map((t) => `[${t}]`)
                            .join('');
                    }
                    return `${info.timestamp} [${info.level}]${service}${tags}: ${info.message}`;
                },
            ),
        ),
        transports: getTransports(configs),
        exitOnError: false,
    };
}

declare module 'winston' {
    interface Logger {
        config: typeof setConfiguration;
    }
}

function setConfiguration(
    this: winston.Logger,
    configs: LoggerConfigurations,
): void {
    const options = getOptions(configs);
    this.configure(options);
}

const logger = winston.createLogger(getOptions());
logger.config = setConfiguration;

export default logger;
