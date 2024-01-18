import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('supplier_library')
export class SupplierLibrary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  video_id: string;

  @Column()
  description: string;

  @Column()
  title: string;

  @Column()
  image: string;

  @Column()
  url: string;

  @Column()
  position: number;

  @Column({ nullable: true })
  is_featured: boolean;

  @Column({ nullable: true })
  publish_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
