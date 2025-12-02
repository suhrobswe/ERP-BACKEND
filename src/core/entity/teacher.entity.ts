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
import { TeacherSpecialization } from 'src/common/enum/specialization.enum';
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
    type: 'enum',
    enum: TeacherSpecialization,
    default: TeacherSpecialization.FULLSTACK,
  })
  @Column({
    type: 'varchar',
    default: '/uploads/b77f4b3654b873c177f590b590180181.jpeg',
  })
  avatarUrl: string;

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
