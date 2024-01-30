import { Supplier } from 'src/supplier/supplier.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('power_ranking')
export class PowerRanking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  object_id: number;

  @Column()
  object_type: number;

  @Column()
  views: number;

  @Column()
  rank: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @OneToOne(() => Supplier, (supplier) => supplier.powerRanking)
  @JoinColumn()
  supplier: Supplier;
}
