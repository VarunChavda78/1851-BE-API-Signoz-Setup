import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LandingPageCustomisation } from './landing-page-customisation.entity'; // Import the customisation entity

@Entity('landing_page_section')
export class LandingPageSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => LandingPageCustomisation, customisation => customisation.section)
  customisations: LandingPageCustomisation[];  
}
