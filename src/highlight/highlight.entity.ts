import { Supplier } from 'src/supplier/supplier.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('highlight')
export class Highlight {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Supplier, (supplier) => supplier.id)
  @Column({ unique: false, nullable: true })
  supplier_id: number;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  content: string;
}
