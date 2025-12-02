import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Roles } from 'src/common/enum/roles.enum';
import { GroupEntity } from './group.entity';
import { Exclude } from 'class-transformer';
import { SpecificationEntity } from './specification.entity';

@Entity('teachers')
export class TeacherEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.TEACHER,
  })
  role: Roles;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  avatarUrl: string;

  @Column({
    type: 'varchar',
    default: 'uploads/dd5074bfd8b7a84c3ab334f556e79558.jpeg',
    nullable: true,
  })
  url: string;

  @OneToMany(() => GroupEntity, (group) => group.teacher)
  groups: GroupEntity[];

  @ManyToMany(() => SpecificationEntity, (spec) => spec.teachers, {
    eager: true,
  })
  @JoinTable({
    name: 'teacher_specifications',
    joinColumn: { name: 'teacherId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'specificationId', referencedColumnName: 'id' },
  })
  specifications: SpecificationEntity[];
}
