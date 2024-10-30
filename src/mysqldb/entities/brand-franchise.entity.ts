import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'brand_franchise' })
export class BrandFranchise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  brand_id: number;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({
    type: 'date',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    type: 'date',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
