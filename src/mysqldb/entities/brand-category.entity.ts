import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('brand_category')
export class BrandCategory {
  @PrimaryGeneratedColumn()
  brand_category_id: number;

  @Column()
  brand_category_name: string;

  @Column({ type: 'timestamp'})
  created_date: Date;

  @Column()
  created_by: number;
}
