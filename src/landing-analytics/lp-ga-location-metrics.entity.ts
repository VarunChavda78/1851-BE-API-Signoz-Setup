// src/landing-analytics/lp-ga-location-metrics.entity.ts
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

@Entity('lp_ga_location_metrics')
export class LpGaLocationMetrics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ length: 255 })
  city: string;

  @Column({ length: 255 })
  country: string;

  @Column({ length: 255 })
  state: string;

  @Column({ type: 'int' })
  pageViews: number;

  @Column({ type: 'int' })
  sessions: number;

  @Column({ type: 'float' })
  sessionDuration: number;

  @Column({ type: 'float' })
  avgSessionDuration: number;

  @Column({ type: 'int' })
  users: number;

  @Column({ type: 'float', default: 0 })
  latitude: number;

  @Column({ type: 'float', default: 0 })
  longitude: number;

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
