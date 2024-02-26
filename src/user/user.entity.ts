import { Role } from 'src/role/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Supplier } from '../supplier/supplier.entity';
import { SlugHistory } from 'src/slug-history/slug-history.entity';
import { UserStatus } from './dtos/UserDto';
import { SocialPlatform } from 'src/social-platform/social-platform.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.id)
  @Column({ unique: false, nullable: true })
  role_id: number;

  @Column({ nullable: true })
  user_name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.DRAFT,
  })
  status?: UserStatus;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToOne(() => Supplier, (supplier) => supplier.user)
  supplier: Supplier;

  @OneToMany(() => SocialPlatform, (socialPlatforms) => socialPlatforms.user)
  socialPlatforms: SocialPlatform;

  // @OneToMany(() => SlugHistory, (slugHistory) => slugHistory.user) 
  // slugHistory: SlugHistory[];
}
