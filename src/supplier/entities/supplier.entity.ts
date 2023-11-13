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

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  location: string;

  @Column()
  description: string;

  @Column()
  logo: string;

  @OneToOne(() => Category, (category) => category.id, {
    eager: true,
  })
  categoryId: Category;

  @Column()
  isFeatured: boolean;

  @Column()
  foundedDate: Date;

  @Column()
  createdBy: Date;

  @Column()
  updatedBy: Date;

  @Column()
  deletedAt: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
