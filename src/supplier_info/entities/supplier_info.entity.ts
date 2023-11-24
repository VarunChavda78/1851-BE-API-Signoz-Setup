import { Media } from 'src/media/entities/media.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('supplier_info')
export class SupplierInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  supplier_id: number;

  @Column()
  highlight_title: string;

  @Column()
  @OneToOne(() => Media, (media) => media.id)
  mts_media_id: number;

  @Column()
  mts_content?: string;

  @Column()
  @OneToOne(() => Media, (media) => media.id)
  difference_media_id: number;

  @Column()
  difference_content: string;

  @Column()
  services?: string;
}
