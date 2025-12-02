import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { TeacherEntity } from './teacher.entity';

@Entity('specifications')
export class SpecificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'varchar', length: 100 })
  name: string; // React Native

  @ManyToMany(() => TeacherEntity, (teacher) => teacher.specifications)
  teachers: TeacherEntity[];
}
