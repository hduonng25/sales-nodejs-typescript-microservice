export interface LoggerConfigurations {
    service: string;
    logFileEnabled?: string;
    folderLogsPath?: string;

    logstashEnabled?: string;
    logstashHost?: string;
    logstashPort?: string;
    logstashProtocol?: string;
}
