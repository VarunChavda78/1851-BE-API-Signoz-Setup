import { Category } from 'src/category/category.entity';
import { User } from 'src/user/user.entity';
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

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @Column({ unique: true })
  user_id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true, unique: false })
  city: string;

  @Column({ nullable: true, unique: false })
  state: string;

  @Column({ nullable: true })
  mts_video: string;

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
  founded?: string;

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

  @Column({ nullable: true, default: 0, type: 'decimal' })
  score?: number;

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
