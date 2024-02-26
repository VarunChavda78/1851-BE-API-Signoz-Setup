import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Supplier } from '../supplier/supplier.entity';
import { User } from '../user/user.entity';
import { SlugObjectType, SlugUserType } from './dtos/SlugHistoryDto';

@Entity('slug_history')
export class SlugHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'slug',nullable: true})
  slug: string;

  @Column({ name: 'object_id', nullable: true })
  objectId: number;

  @Column({ name: 'user_type',nullable:true, enum: SlugUserType})
  userType: SlugUserType;

  @Column({ name: 'created_by'})
  createdBy: number;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'object_type',nullable: true})
  objectType: SlugObjectType;

//   @ManyToOne(() => Supplier, supplier => supplier.slugHistory, { nullable: true })
//   supplier: Supplier;

//   @ManyToOne(() => User, user => user.slugHistory, { nullable: true })
//   user: User;
}
