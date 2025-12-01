// video/video.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { MulterModule } from '@nestjs/platform-express';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { VideoProcessor } from './video.processor'; // Worker
import { Video } from 'src/core';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs-extra';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
        password: '53531', // <--- SHU YERGA PAROLNI YOZING
      },
    }),

    // Redis Queue sozlamasi (Worker uchun)
    BullModule.registerQueue({
      name: 'video-transcode',
      defaultJobOptions: {
        attempts: 3, // Xato bo'lsa 3 marta qayta urinsin
        backoff: { type: 'exponential', delay: 3000 }, // Qayta urinishda 3s kutib turadi
        removeOnComplete: true,
      },
    }),

    // Fayl yuklash joyi
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const path = './uploads/raw';
          fs.ensureDirSync(path); // Papka bo'lmasa ochadi
          cb(null, path);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoProcessor],
})
export class VideoModule {}
