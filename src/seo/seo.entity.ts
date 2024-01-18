import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { SeoKeyword } from './seoKeyword.entity';
import { SeoType } from './seoType.entity';

@Entity('seo')
export class Seo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SeoType, (seoType) => seoType.seo)
  @JoinColumn()
  seoType: SeoType;

  @Column({ nullable: true })
  object_id: number;

  @Column()
  object_type: number;

  @Column()
  page_title: string;

  @Column()
  meta_title: string;

  @Column()
  meta_description: string;

  @OneToMany(() => SeoKeyword, (seoKeyword) => seoKeyword.seo)
  seoKeyword: SeoKeyword;
}
