import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Supplier } from '../supplier/supplier.entity';
import { User } from '../user/user.entity';
import { SlugObjectType, SlugUserType } from './dtos/SlugHistoryDto';

@Entity('slug_history')
export class SlugHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  object_id: number;

  @Column()
  user_type: SlugUserType;

  @Column()
  created_by: number;

  @Column()
  created_at: Date;

  @Column()
  object_type: SlugObjectType;

}
