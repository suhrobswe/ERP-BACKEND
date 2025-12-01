// video/entities/video.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger'; // Swagger uchun
import { LessonEntity } from './lesson.entity';

export enum VideoStatus {
  UPLOADING = 'UPLOADING',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  FAILED = 'FAILED',
}

@Entity()
export class Video {
  @ApiProperty({ example: 'uuid-v4-id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(() => LessonEntity, (lesson) => lesson.videos)
  // @JoinColumn({ name: 'lessonId' })
  @Column({ nullable: true, type:'varchar'})
  lessonId?: string; // YANGI QO'SHILDI

  @ApiProperty({ example: 'Kirish darsi' })
  @Column()
  title: string;

  @Column()
  originalPath: string;

  @ApiProperty({ nullable: true, example: '/stream/uuid/master.m3u8' })
  @Column({ nullable: true })
  hlsPath: string;

  @ApiProperty({ enum: VideoStatus })
  @Column({
    type: 'enum',
    enum: VideoStatus,
    default: VideoStatus.UPLOADING,
  })
  status: VideoStatus;

  @ApiProperty({ example: 45 })
  @Column({ default: 0 })
  percent: number;

  @CreateDateColumn()
  createdAt: Date;
}
