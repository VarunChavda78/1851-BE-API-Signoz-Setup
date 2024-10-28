import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'registration' })
export class Registration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  first_name: string;

  @Column({ type: 'varchar', length: 50 })
  last_name: string;

  @Column({ type: 'varchar', length: 50 })
  company: string;

  @Column({ type: 'varchar', length: 200 })
  brand_url: string;

  @Column({ type: 'varchar', length: 50 })
  disqus_short_name: string;

  @Column({ type: 'text' })
  brandLogo: string;

  @Column({ type: 'text' })
  meta_image: string;

  @Column({ type: 'int' })
  brand_category_id: number;

  @Column({ type: 'text' })
  photo: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  phone: string;

  @Column({ type: 'int', nullable: true })
  ext: number;

  @Column({ type: 'varchar', length: 50 })
  user_name: string;

  @Column()
  user_description: string;

  @Column({ type: 'text', nullable: true })
  author_title: string;

  @Column({ type: 'text', nullable: true })
  about_text: string;

  @Column({ type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  access_token: string;

  @Column({ type: 'date' })
  registration_date: Date;

  @Column({
    type: 'enum',
    enum: ['Starter', 'Visibility', 'Increase', 'Enterprise'],
    default: 'Starter',
  })
  type: string;

  @Column({
    type: 'enum',
    enum: ['complete', 'incomplete', 'cancel'],
    default: 'incomplete',
  })
  payment_status: string;

  @Column({ type: 'varchar', length: 200 })
  payment: string;

  @Column({ type: 'date' })
  pay_date: Date;

  @Column({ type: 'date' })
  expire_date: Date;

  @Column({ type: 'enum', enum: ['1', '2', '3'], default: '1' })
  pending_ipn: string;

  @Column({ type: 'varchar', length: 50 })
  pending: string;

  @Column({ type: 'enum', enum: ['user', 'author'], default: 'user' })
  user_type: string;

  @Column({
    type: 'enum',
    enum: ['approve', 'disapprove'],
    default: 'disapprove',
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ['Own', 'Contact', 'Customize', 'None'],
    nullable: true,
    default: 'None',
  })
  navBrandTitle: string;

  @Column({ type: 'varchar', length: 100 })
  navBrandCustTitle: string;

  @Column({ type: 'varchar', length: 100 })
  gaCode: string;

  @Column({
    type: 'enum',
    enum: ['nolimit', 'outSiders'],
    default: 'outSiders',
  })
  usersFrom: string;

  @Column({ type: 'text' })
  bQual_link: string;

  @Column({ type: 'enum', enum: ['yes', 'no'], default: 'yes' })
  bQual_link_visible: string;

  @Column({ type: 'int', nullable: true })
  parent_id: number;

  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @Column({ type: 'varchar', length: 50 })
  gaViewcode: string;

  @Column()
  is_admin: number;

  @Column({ type: 'text', nullable: true })
  twitter_link: string;

  @Column({ type: 'text', nullable: true })
  facebook_link: string;

  @Column({ type: 'text', nullable: true })
  linkedin_link: string;

  @Column({ type: 'text', nullable: true })
  google_link: string;

  @Column({ type: 'text', nullable: true })
  instagram_link: string;

  @Column({ type: 'varchar', length: 50 })
  franConnectEmail: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  mailchimp_list_id: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  ampd_report_url: string;

  @Column({ type: 'int', default: 20 })
  brand_landing_page_limit: number;

  @Column({ type: 'varchar', length: 250, nullable: true })
  ampd_report_url_previous_month: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  ampd_report_url_before_previous_month: string;

  @Column({ type: 'text', nullable: true })
  story_approval_email: string;

  @Column({ type: 'varchar', length: 250, nullable: true })
  facebook_page: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  gtm: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  property_id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  measurement_id: string;

  @Column({ type: 'int', default: 1, nullable: true })
  author_index: number;

  @Column({ type: 'varchar', length: 300 })
  franchise_link: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'int' })
  created_by: number;

  @Column({ type: 'int' })
  updated_by: number;

  @Column({ type: 'int' })
  is_deleted: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  created_user_type: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  updated_user_type: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  google_ads_account_id: string;

  @Column({ type: 'text', nullable: true })
  disclaimer?: string;
}
