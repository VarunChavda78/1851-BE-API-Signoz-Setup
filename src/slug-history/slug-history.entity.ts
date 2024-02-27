import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Supplier } from '../supplier/supplier.entity';
import { User } from '../user/user.entity';
import { SlugObjectType, SlugUserType } from './dtos/SlugHistoryDto';

@Entity('slug_history')
export class SlugHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  slug: string;

  @Column({nullable: true })
  object_id: number;

  @Column({nullable:true})
  user_type: SlugUserType;

  @Column({nullable: true})
  created_by: number;

  @Column({nullable: true})
  created_at: Date;

  @Column({nullable: true})
  object_type: SlugObjectType;

}
