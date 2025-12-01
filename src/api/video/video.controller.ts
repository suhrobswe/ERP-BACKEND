// video/video.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  Delete,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';
import { type Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'; // Importlar
import { CreateVideoDto } from './dto/create-video.dto';
import { Video } from 'src/core';

@ApiTags('videos') // Swaggerda guruhlash uchun
@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  // 1. UPLOAD (Swagger qo'shildi)
  @Post('upload')
  @ApiOperation({ summary: 'Katta videoni yuklash' })
  @ApiConsumes('multipart/form-data') // Form-data qabul qilish
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: "Video fayli va ma'lumotlari",
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        lessonId: { type: 'string', format: 'uuid' },
        video: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Video qabul qilindi', type: Video })
  @UseInterceptors(FileInterceptor('video'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateVideoDto, // DTO orqali ma'lumotlarni olish
  ) {
    if (!file) throw new BadRequestException('Fayl tanlanmagan');

    // Servicega lessonId ni ham yuboramiz
    return this.videoService.uploadVideo(file, body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Video statusini tekshirish' })
  async getStatus(@Param('id') id: string) {
    return this.videoService.getVideoInfo(id);
  }

  @Get('stream/:videoId/:file')
  @ApiOperation({ summary: 'Videoni stream qilish (Player uchun)' })
  async streamVideo(
    @Param('videoId') videoId: string,
    @Param('file') fileName: string,
    @Res() res: Response,
  ) {
    const filePath = join(process.cwd(), 'uploads', 'hls', videoId, fileName);

    if (fs.existsSync(filePath)) {
      res.setHeader(
        'Content-Type',
        fileName.endsWith('.m3u8')
          ? 'application/vnd.apple.mpegurl'
          : 'video/MP2T',
      );
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    } else {
      res.status(404).send('File topilmadi');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: "Videoni o'chirish" })
  async delete(@Param('id') id: string) {
    return this.videoService.deleteVideo(id);
  }
}
