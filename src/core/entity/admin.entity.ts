import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Roles } from 'src/common/enum/roles.enum';
import { Exclude } from 'class-transformer';

@Entity('admin')
export class AdminEntity extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar' })
  fullName: string;

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', default: '' })
  avatarUrl: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.ADMIN })
  role: Roles;
}
