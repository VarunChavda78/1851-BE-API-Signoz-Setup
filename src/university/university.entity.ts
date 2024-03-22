
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UniversityType } from '../shared/constants/constants';

@Entity('university')
export class University {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique : false})
  heading: string;

  @Column({unique : false})
  url: string;

  @Column({ nullable: true, unique: false })
  image: string;

  @Column({ nullable: true, unique: false })
  pdf: string;

  @Column()
  type: UniversityType;

  @Column({ nullable: true , default: 1})
  sort_id: number;

  @Column({ nullable: true })
  created_by?: number | null;

  @Column({ nullable: true })
  updated_by?: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
