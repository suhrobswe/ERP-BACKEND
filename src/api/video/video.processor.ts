// video/video.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { VideoService } from './video.service';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs-extra';
import * as path from 'path';

@Processor('video-transcode')
export class VideoProcessor extends WorkerHost {
  constructor(private readonly videoService: VideoService) {
    super();
  }

  async process(job: Job): Promise<any> {
    const { videoId, filePath } = job.data;

    const outputDir = path.join(process.cwd(), 'uploads', 'hls', videoId);
    await fs.ensureDir(outputDir);

    const outputPath = path.join(outputDir, 'master.m3u8');

    return new Promise((resolve, reject) => {
      ffmpeg(filePath)
        .addOptions([
          '-profile:v baseline',
          '-level 3.0',
          '-start_number 0',
          '-hls_time 10',
          '-hls_list_size 0',
          '-hls_segment_filename',
          path.join(outputDir, 'chunk_%03d.m2ts'), // IMPORTANT!!!
          '-f hls',
        ])
        .output(outputPath)
        .on('progress', async (progress) => {
          console.log(`Video ${videoId}: ${progress.percent}%`);
          await this.videoService.updateProgress(videoId, progress.percent ?? 0);
        })
        .on('end', async () => {
          console.log(`Video ${videoId} successfully processed!`);
          await this.videoService.completeProcessing(
            videoId,
            `/videos/stream/${videoId}/master.m3u8`,
          );
          resolve(true);
        })
        .on('error', async (err) => {
          console.error(`Video ${videoId} FAILED:`, err);
          await this.videoService.failProcessing(videoId);
          reject(err);
        })
        .run();
    });
  }
}
