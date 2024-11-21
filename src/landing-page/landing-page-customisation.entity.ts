import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { LandingPageSection } from './landing-page-section.entity'; // Import section entity

@Entity('landing_page_customisation')
export class LandingPageCustomisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brandId: number;

  @ManyToOne(() => LandingPageSection, section => section.customisations)
  section: LandingPageSection; 

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
