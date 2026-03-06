import { Global, Module } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import { colorizeText } from './colorize.text';
import * as winston from 'winston';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [
        new winston.transports.File({
          filename: 'logs/info-app.log',
          level: 'info',
          maxsize: 1 * 1024 * 1024,
          maxFiles: 10,
          format: winston.format.combine(
            winston.format.simple(),
            winston.format.timestamp({ format: 'dd/MMM/YYYY HH:mm:ss' }),
            winston.format.printf(({ level, message, timestamp }) => {
              const msg = message ?? 'MESSAGE TIDAK TERDETEKSI';
              return `${timestamp} [${level.toUpperCase()}]: ${msg}`;
              // return `${timestamp} [${level.toUpperCase()}]: ${message.toString().replace('[1mPOST[0m [32m', '').replace('[0m', '')}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error-app.log',
          level: 'error',
          maxsize: 1 * 1024 * 1024,
          maxFiles: 5,
          format: winston.format.combine(
            winston.format.simple(),
            winston.format.timestamp({ format: 'dd/MMM/YYYY HH:mm:ss' }),
            winston.format.printf(({ level, message, timestamp }) => {
              const msg = message ?? 'MESSAGE TIDAK TERDETEKSI';
              return `${timestamp} [${level.toUpperCase()}]: ${msg}`;
              // return `${timestamp} [${level.toUpperCase()}]: ${message.toString().replace('[1mPOST[0m [32m', '').replace('[0m', '')}`;
            }),
          ),
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.simple(),
            winston.format.timestamp({ format: 'dd/MMM/YYYY HH:mm:ss' }),
            nestWinstonModuleUtilities.format.nestLike('MyApp', {
              colors: true,
              prettyPrint: true,
              processId: true,
              appName: true,
            }),
          ),
        }),
      ],
    }),
  ],
  providers: [],
  exports: [WinstonModule],
})
export class CommonModule {}
