import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('customize_user_sidebar')
export class NavigationMenu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  user_id: string;

  @Column({ type: 'text', nullable: false })
  brand_pdf: string;

  @Column({ type: 'text', nullable: false })
  website: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  info_title: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  section_title: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  linkTitle1: string;

  @Column({ type: 'text', nullable: false })
  linkUrl1: string;

  @Column({ type: 'int', nullable: true })
  isExternalLink1: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkImage1: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  linkTitle2: string;

  @Column({ type: 'text', nullable: false })
  linkUrl2: string;

  @Column({ type: 'int', nullable: true })
  isExternalLink2: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkImage2: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  linkTitle3: string;

  @Column({ type: 'text', nullable: false })
  linkUrl3: string;

  @Column({ type: 'int', nullable: true })
  isExternalLink3: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkImage3: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  linkTitle4: string;

  @Column({ type: 'text', nullable: false })
  linkUrl4: string;

  @Column({ type: 'int', nullable: true })
  isExternalLink4: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkImage4: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  linkTitle5: string;

  @Column({ type: 'text', nullable: false })
  linkUrl5: string;

  @Column({ type: 'int', nullable: true })
  isExternalLink5: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkImage5: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  linkTitle6: string;

  @Column({ type: 'text', nullable: false })
  linkUrl6: string;

  @Column({ type: 'int', nullable: true })
  isExternalLink6: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkImage6: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  linkTitle7: string;

  @Column({ type: 'text', nullable: false })
  linkUrl7: string;

  @Column({ type: 'int', nullable: true })
  isExternalLink7: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkImage7: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  linkTitle8: string;

  @Column({ type: 'text', nullable: false })
  linkUrl8: string;

  @Column({ type: 'int', nullable: true })
  isExternalLink8: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkImage8: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  linkTitle9: string;

  @Column({ type: 'text', nullable: false })
  linkUrl9: string;

  @Column({ type: 'int', nullable: true })
  isExternalLink9: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkImage9: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  linkTitle10: string;

  @Column({ type: 'text', nullable: false })
  linkUrl10: string;

  @Column({ type: 'int', nullable: true })
  isExternalLink10: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkImage10: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  linkTitle11: string;

  @Column({ type: 'text', nullable: false })
  linkUrl11: string;

  @Column({ type: 'int', nullable: true })
  isExternalLink11: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkImage11: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  linkTitle12: string;

  @Column({ type: 'text', nullable: false })
  linkUrl12: string;

  @Column({ type: 'int', nullable: true })
  isExternalLink12: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkImage12: string;

  @Column({ type: 'text', nullable: false })
  twitter_link: string;

  @Column({ type: 'text', nullable: false })
  facebook_link: string;

  @Column({ type: 'text', nullable: false })
  linkedin_link: string;

  @Column({ type: 'text', nullable: false })
  google_link: string;

  @Column({ type: 'text', nullable: false })
  instagram_link: string;

  @Column({ type: 'enum', enum: ['Yes', 'No'], default: 'No', nullable: false })
  access_pdf_by_email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  brand_feature_image: string;
}