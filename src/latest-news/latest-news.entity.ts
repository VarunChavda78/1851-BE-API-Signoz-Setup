import { Supplier } from 'src/supplier/supplier.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('latest_news')
export class LatestNews {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Supplier, (supplier) => supplier.id)
  @Column({ unique: false, nullable: true })
  supplier_id: number;

  @Column()
  article_id: string;
}
