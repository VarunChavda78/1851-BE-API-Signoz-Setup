import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
