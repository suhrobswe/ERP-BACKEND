import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const winstonConfig = WinstonModule.createLogger({
  transports: [
    // 1. Konsolga chiqarish (Chiroyli rangli qilib)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('MyApp', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
    // 2. Xatolarni faylga yozish (Faqat error leveldagilarni)
    new winston.transports.DailyRotateFile({
      dirname: 'logs/error', // logs papkasi ichida error papkasi ochadi
      filename: 'error-%DATE%.log', // Fayl nomi: error-2025-11-23.log
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // Eskirgan loglarni arxivlaydi (joy tejash uchun)
      maxSize: '20m', // Fayl 20mb dan oshsa yangisini ochadi
      maxFiles: '20d', // 14 kundan eski loglarni o'chirib tashlaydi
      level: 'error', // Faqat errorlarni yozadi
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(), // Faylga JSON formatda yozadi
      ),
    }),
    // 3. Barcha loglarni faylga yozish (ixtiyoriy)
    new winston.transports.DailyRotateFile({
      dirname: 'logs/info',
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '20d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
