import 'dotenv/config';

export const configs = {
    environment: 'dev',
    service: 'order',
    mongo: {
        dbName: process.env.DB_NAME || '',
        username: process.env.USER_DB || '',
        password: process.env.PASSWORD_DB || '',
        port: process.env.PORT_DB || '',
        host: process.env.HOST_DB || '',

        congifUri:
            'mongodb://${username}:${password}@${host}:${port}/${dbName}?retryWrites=true&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000`;',

        getUri: function (): string {
            let uri = this.congifUri;
            uri = uri.replace('${username}', this.username);
            uri = uri.replace('${password}', this.password);
            uri = uri.replace('${host}', this.host);
            uri = uri.replace('${port}', this.port);
            uri = uri.replace('${dbName}', this.dbName);
            uri = uri.replace('${dbName}', this.dbName);
            uri = `${uri}`;
            return uri;
        },
    },

    app: {
        prefix: '/api',
        host: process.env.HOST_MAIN || '0.0.0.0',
        port: process.env.PORT_NODE,
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

    keys: {
        public: process.env.PUBLIC_KEY || '',
    },

    services: {
        product: {
            product_prefix: process.env.PRODUCT_PREFIX || '',
            product_host: process.env.PRODUCT_HOST || '',
            product_port: process.env.PRODUCT_PORT || '3002',
            api: function (): string {
                return `${this.product_host}:${this.product_port}${this.product_prefix}`;
            },
        },
    },
};
