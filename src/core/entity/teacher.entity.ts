import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Roles } from 'src/common/enum/roles.enum';
import { TeacherSpecialization } from 'src/common/enum/specialization.enum';
import { GroupEntity } from './group.entity';

@Entity('teachers')
export class TeacherEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
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
  specification: TeacherSpecialization;

  @OneToMany(() => GroupEntity, (group) => group.teacher)
  groups: GroupEntity[];
}
