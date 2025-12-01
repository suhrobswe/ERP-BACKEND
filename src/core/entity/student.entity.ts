import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GroupEntity } from './group.entity';
import { Exclude } from 'class-transformer';

export enum StudentRole {
  STUDENT = 'student',
  PREMIUM_STUDENT = 'premium_student',
}

@Entity('students')
export class StudentEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: StudentRole,
    default: StudentRole.STUDENT,
  })
  role: StudentRole;

  @Column({ type: 'varchar', default: '' })
  avatarUrl: string;

  @Column({ type: 'uuid', nullable: true })
  groupId: string;

  @ManyToOne(() => GroupEntity, (group) => group.students, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'groupId' })
  group: GroupEntity;
}
