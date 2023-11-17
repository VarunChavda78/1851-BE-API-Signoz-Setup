import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true, unique: false })
  location: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  logo?: string | null;

  @OneToOne(() => Category, (category) => category.id)
  // @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  // category: Category;
  @Column({ nullable: true, unique: false })
  categoryId: number;

  @Column()
  isFeatured: boolean;

  @Column({ nullable: true })
  founded?: number;

  @Column({ nullable: true })
  videoUrl?: string | null;

  @Column({ nullable: true, type: 'decimal', default: 0 })
  rating?: number;

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
