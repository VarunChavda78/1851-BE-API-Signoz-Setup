import { LpPage } from '../landing/lp-page.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('ga_credentials')
export class GACredential {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brandId: number;

  @ManyToOne(() => LpPage, { nullable: true })
  @JoinColumn({ name: 'landingPageId' })
  landingPage: LpPage;

  @Column({ nullable: true })
  propertyId: string; 

  @Column({ type: 'text' })
  accessToken: string;

  @Column({ type: 'text' })
  refreshToken: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
