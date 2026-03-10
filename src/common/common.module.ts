import { Global, Module } from '@nestjs/common';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { ValidationService } from './validation/validation.service';
import { JWT_CONST } from './config/constant';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 1000, limit: 3 }]),
    ServeStaticModule.forRoot({
      rootPath: join('./uploads'), // Direktori tempat gambar disimpan
      serveRoot: '/uploads', // URL path untuk mengakses gambar
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    JwtModule.register({
      global: true,
      secret: JWT_CONST.secret,
      // signOptions: { expiresIn: '60m' },
    }),
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
  providers: [ValidationService, { provide: APP_GUARD, useClass: ThrottlerGuard }, PrismaService],
  exports: [ValidationService, WinstonModule, PrismaService],
})
export class CommonModule {}
