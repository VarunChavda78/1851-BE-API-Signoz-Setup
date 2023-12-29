import { Media } from 'src/media/entities/media.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LatestNewsType } from '../dtos/supplierInfoDto';

@Entity('supplier_info')
export class SupplierInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  supplier_id: number;

  @Column({ nullable: true })
  @OneToOne(() => Media, (media) => media.id)
  banner_media_id?: number;

  @Column({ nullable: true })
  highlight_title: string;

  @Column({ nullable: true })
  @OneToOne(() => Media, (media) => media.id)
  ats_media_id: number;

  @Column({ nullable: true })
  ats_content?: string;

  @Column({ nullable: true })
  @OneToOne(() => Media, (media) => media.id)
  service_media_id: number;

  @Column({ nullable: true })
  service_content: string;

  @Column({
    type: 'enum',
    enum: LatestNewsType,
    nullable: true,
  })
  latest_news_type_id?: LatestNewsType;

  @Column({ nullable: true })
  website: string;
}
