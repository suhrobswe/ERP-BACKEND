import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { LessonEntity } from './lesson.entity';

export enum DocumentType {
  PDF = 'pdf',
  DOC = 'doc',
  DOCX = 'docx',
  PPT = 'ppt',
  PPTX = 'pptx',
  TXT = 'txt',
  XLS = 'xls',
  XLSX = 'xlsx',
}

@Entity('documents')
export class DocumentEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 500 })
  documentUrl: string;

  @Column({ type: 'bigint' })
  size: number; // bytes

  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.PDF,
  })
  type: DocumentType;

  @Column({ type: 'uuid' })
  lessonId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  pageCount: number;

  @ManyToOne(() => LessonEntity, (lesson) => lesson.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'lessonId' })
  lesson: LessonEntity;
}
