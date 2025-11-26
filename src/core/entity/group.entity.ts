import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { LessonEntity } from './lesson.entity';
import { StudentEntity } from './student.entity';
import { TeacherEntity } from './teacher.entity';

@Entity('groups')
export class GroupEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'date' })
  lessonTime: Date;

  @OneToMany(() => StudentEntity, (student) => student.group)
  students: StudentEntity[];

  @OneToMany(() => LessonEntity, (lesson) => lesson.group)
  lessons: LessonEntity[];

  @ManyToOne(() => TeacherEntity, (teacher) => teacher.groups)
  @JoinColumn({ name: 'teacherId' })
  teacher: TeacherEntity;

  @Column({ type: 'uuid', nullable: true })
  teacherId: string;
}
