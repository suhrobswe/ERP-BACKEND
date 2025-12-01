import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GroupEntity } from './group.entity';
import { Video } from './video.entity';
import { DocumentEntity } from './document.entity';

@Entity('lessons')
export class LessonEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid' })
  groupId: string;

  @Column({ type: 'int', default: 1 })
  orderNumber: number;

  @ManyToOne(() => GroupEntity, (group) => group.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'groupId' })
  group: GroupEntity;

  // @OneToMany(() => Video, (video) => video.lessonId)
  // videos: Video[];

  @OneToMany(() => DocumentEntity, (document) => document.lesson)
  documents: DocumentEntity[];
}
