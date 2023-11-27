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

  @Column({ unique: true })
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
  category_id: number;

  @Column()
  is_featured: boolean;

  @Column({ nullable: true })
  founded?: number;

  @Column({ nullable: true })
  video_url?: string | null;

  @Column({
    nullable: true,
    type: 'decimal',
    default: 0,
    precision: 5,
    scale: 2,
  })
  rating?: number;

  @Column({ nullable: true, default: 0 })
  review?: number;

  @Column({ nullable: true })
  created_by?: number | null;

  @Column({ nullable: true })
  updated_by?: number | null;

  @Column({ nullable: true })
  deleted_at?: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
