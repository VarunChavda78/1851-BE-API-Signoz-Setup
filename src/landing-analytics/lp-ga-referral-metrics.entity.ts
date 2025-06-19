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

@Entity('lp_ga_referral_metrics')
export class LpGaReferralMetrics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ length: 255 })
  source: string;

  @Column({ type: 'int' })
  sessions: number;

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