import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('faq')
export class Faq {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brandId: number;

  @Column()
  question: string;

  @Column()
  answer: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  createdBy: number;

  @Column()
  updatedBy: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
