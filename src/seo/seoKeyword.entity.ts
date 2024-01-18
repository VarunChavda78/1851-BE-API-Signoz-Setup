import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Seo } from './seo.entity';

@Entity('seo_keyword')
export class SeoKeyword {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Seo, (seo) => seo.seoKeyword)
  @JoinColumn()
  seo: Seo;

  @Column()
  name: string;
}
