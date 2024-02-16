import 'dotenv/config';

export const configs = {
    service: 'payment',
    environment: process.env.PAYMENT_ENVIRONMENT || 'dev',

    app: {
        prefix: process.env.PAYMENT_PREFIX || '',
        host: process.env.PAYMENT_HOSTNAME || '',
        port: process.env.PAYMENT_PORT || '',
    },

    payos: {
        client: process.env.PAYOS_CLIENT_ID,
        key: process.env.PAYOS_API_KEY,
        checksum: process.env.PAYOS_CHECKSUM_KEY,
        returnUrl: process.env.RETURN_URL,
        cancelUrl: process.env.CANCEL_URL,
    },

    log: {
        logFileEnabled: process.env.LAB_LOG_FILE_ENABLED || 'true',
        folderLogsPath:
            process.env.LAB_FOLDER_LOGS_PATH ||
            `${__dirname}/../../logs`,

        logstashEnabled:
            process.env.LAB_LOG_LOGSTASH_ENABLED || 'false',
        logstashHost:
            process.env.LAB_LOG_LOGSTASH_HOST || '127.0.0.1',
        logstashPort: process.env.LAB_LOG_LOGSTASH_PORT || '50001',
        logstashProtocol:
            process.env.LAB_LOG_LOGSTASH_PROTOCOL || 'udp',
    },
};
