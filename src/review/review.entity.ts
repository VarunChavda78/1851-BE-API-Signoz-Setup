import { Supplier } from 'src/supplier/supplier.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReviewStatus } from './dtos/reviewDto';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.id)
  @Column({ unique: false, nullable: true })
  supplier_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  comment: string;

  @Column({ nullable: true })
  rating: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  role: number;

  @Column({ nullable: true })
  other_text: string;

  @Column({
    default: ReviewStatus.REQUESTED,
  })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
}
