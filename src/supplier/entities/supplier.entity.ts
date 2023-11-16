import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  location: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  logo?: string | null;

  @OneToOne(() => Category, (category) => category.id, {
    eager: true,
  })
  @JoinColumn()
  categoryId: number;

  @Column()
  isFeatured: boolean;

  @Column({ nullable: true })
  founded?: number;

  @Column({ nullable: true })
  videoUrl?: string | null;

  @Column({ nullable: true })
  createdBy?: number | null;

  @Column({ nullable: true })
  updatedBy?: number | null;

  @Column({ nullable: true })
  deletedAt?: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
