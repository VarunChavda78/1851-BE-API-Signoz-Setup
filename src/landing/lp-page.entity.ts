import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { LpTemplate } from './lp-template.entity'; 

@Entity('lp_pages')
export class LpPage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brandId: number;

  @Column()
  templateId: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  brandSlug: string;

  @Column()
  status: number;

  @Column({ nullable: true })
  domainType: number;

  @Column({ length: 255, nullable: true })
  domain: string;

  @Column({ length: 255, nullable: true })
  customDomainStatus: string;

  @Column()
  createdBy: number;

  @Column()
  updatedBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date; 

  @ManyToOne(() => LpTemplate, (template) => template.id)
  template: LpTemplate; 
}
