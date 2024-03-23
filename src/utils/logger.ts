import { WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';

export class Logger {
    private readonly env: string;

    constructor() {
        this.env = process.env.NODE_ENV;
    }

    private consoleTransport(): winston.transport {
        return new winston.transports.Console({
            level: this.env === 'production' ? 'warn' : 'silly',
        });
    }

    private customLogFormat(): winston.Logform.Format {
        return winston.format.printf(({ timestamp, level, stack, message }) => {
            return `${timestamp} - [${level}] - ${message} ${stack || ''}`;
        });
    }

    private formatCombine(): winston.Logform.Format {
        return winston.format.combine(
            winston.format.colorize(),
            winston.format.splat(),
            winston.format.errors({ stack: !(this.env === 'production') }),
            winston.format.json(),
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            utilities.format.nestLike('products-api'),
            this.customLogFormat(),
        );
    }

    public getLoggerConfig(): WinstonModuleOptions {
        return {
            format: this.formatCombine(),
            transports: [this.consoleTransport()],
        };
    }
}
