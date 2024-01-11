import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('seo_type')
export class SeoType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // @OneToMany(() => Seo, (seo) => seo.seoType)
  // seo: Seo;
}

@Entity('seo')
export class Seo {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => SeoType, (seoType) => seoType.seo)
  @ManyToOne(() => SeoType)
  @JoinColumn()
  seoType: SeoType;

  @Column()
  object_id: number;

  @Column()
  object_type: number;

  @Column()
  page_title: string;

  @Column()
  meta_title: string;

  @Column()
  meta_description: string;

  // @OneToMany(() => SeoKeyword, (seoKeyword) => seoKeyword.seo)
  // seoKeyword: SeoKeyword;
}

@Entity('seo_keyword')
export class SeoKeyword {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => Seo, (seo) => seo.seoKeyword)
  @ManyToOne(() => Seo)
  @JoinColumn()
  seo: Seo;

  @Column()
  name: string;
}
