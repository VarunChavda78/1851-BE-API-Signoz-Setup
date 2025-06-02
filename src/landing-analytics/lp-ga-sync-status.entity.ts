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

@Entity('lp_ga_sync_status')
export class LpGaSyncStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  brandId: number;

  @ManyToOne(() => LpPage, { nullable: true })
  @JoinColumn({ name: 'landingPageId' })
  landingPage: LpPage;

  @Column({ type: 'timestamp', nullable: true })
  lastSynced: Date;

  @Column({ nullable: true })
  lastSyncStatus: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
