import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { LpSection } from './lp-section.entity';

@Entity('lp_customisation')
export class LpCustomisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  landingPageId: number;

  @ManyToOne(() => LpSection, section => section.customisations)
  section: LpSection;

  @Column('json')
  content: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  createdBy: number;

  @Column()
  updatedBy: number;
}
