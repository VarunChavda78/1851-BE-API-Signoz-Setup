import { LpPage } from '../landing/lp-page.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('lp_ga_summary')
export class LpGaSummary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'int' })
  pageViews: number;

  @Column({ type: 'int' })
  sessions: number;

  @Column({ type: 'int' })
  sessionDuration: number;

  @Column({ type: 'float' })
  avgSessionDuration: number;

  @Column({ type: 'int' })
  users: number;

  @Column({ type: 'float' })
  bounceRate: number;

  @Column()
  brandId: number;

  @ManyToOne(() => LpPage, { nullable: true })
  @JoinColumn({ name: 'landingPageId' })
  landingPage: LpPage;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
