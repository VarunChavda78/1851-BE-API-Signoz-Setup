import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LpCustomisation } from './lp-customisation.entity';

@Entity('lp_sections')
export class LpSection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lpTemplatePageId: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @OneToMany(() => LpCustomisation, customisation => customisation.section)
  customisations: LpCustomisation[];  
}
