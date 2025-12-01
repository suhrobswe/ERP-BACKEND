// video/video.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Video, VideoStatus } from '../../core';
import * as fs from 'fs-extra';
import { CreateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video) private videoRepo: Repository<Video>,
    @InjectQueue('video-transcode') private transcodeQueue: Queue,
  ) {}

  // Parameterga lessonId qo'shildi
  async uploadVideo(file: Express.Multer.File, body: CreateVideoDto) {
    const { title, lessonId } = body;
    let newVideo = {};
    if (lessonId) {
      newVideo = this.videoRepo.create({
        title,
        lessonId, // Yangi field
        originalPath: file.path,
        status: VideoStatus.QUEUED,
        percent: 0,
      });
    } else {
      newVideo = this.videoRepo.create({
        title,
        originalPath: file.path,
        status: VideoStatus.QUEUED,
        percent: 0,
      });
    }
    const savedVideo = await this.videoRepo.save(newVideo);

    await this.transcodeQueue.add('transcode', {
      videoId: savedVideo.id,
      filePath: file.path,
    });

    return savedVideo;
  }

  // 2. Read: Video haqida ma'lumot (Player statusni tekshirishi uchun)
  async getVideoInfo(id: string) {
    const video = await this.videoRepo.findOneBy({ id });
    if (!video) throw new NotFoundException('Video topilmadi');
    return video;
  }

  // 3. Worker chaqiradigan method: Foizni yangilash
  async updateProgress(id: string, percent: number) {
    await this.videoRepo.update(id, {
      status: VideoStatus.PROCESSING,
      percent: Math.round(percent),
    });
  }

  // 4. Worker chaqiradigan method: Tugatish
  async completeProcessing(id: string, hlsPath: string) {
    await this.videoRepo.update(id, {
      status: VideoStatus.READY,
      percent: 100,
      hlsPath: hlsPath,
    });
    // Ixtiyoriy: Original katta faylni o'chirish
    // const video = await this.videoRepo.findOneBy({id});
    // fs.unlink(video.originalPath).catch(err => console.error(err));
  }

  // 5. Worker chaqiradigan method: Xato
  async failProcessing(id: string) {
    await this.videoRepo.update(id, { status: VideoStatus.FAILED });
  }

  // 6. Delete
  async deleteVideo(id: string) {
    const video = await this.videoRepo.findOneBy({ id });
    if (video) {
      if (video.hlsPath) await fs.remove(`./uploads/hls/${id}`); // Papkani o'chirish
      if (video.originalPath)
        await fs.remove(video.originalPath).catch(() => null);
      await this.videoRepo.remove(video);
    }
    return { message: "O'chirildi" };
  }
}
