import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Seo } from './seo.entity';

@Entity('seo_type')
export class SeoType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Seo, (seo) => seo.seoType)
  seo: Seo;
}
