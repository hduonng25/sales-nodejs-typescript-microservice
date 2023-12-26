import 'dotenv/config';

export const config = {
    environment: 'dev',
    service: 'mail',
    mongo: {
        dbName: process.env.DB_NAME || '',
        host: process.env.HOST_DB || '',
        username: process.env.USER_DB || '',
        password: process.env.PASSWORD_DB || '',
        port: process.env.PORT_DB || '',

        configUri:
            'mongodb://${username}:${password}@${host}:${port}/${dbName}?retryWrites=true&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000`;',

        getUri: function (): string {
            let uri = this.configUri;
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

    mails: {
        service: process.env.SERVICE_MAIL,
        user: process.env.USER_MAIL,
        pass: process.env.PASSWORD_MAIL,
    },

    log: {},
};
