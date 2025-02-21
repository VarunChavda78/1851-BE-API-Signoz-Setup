import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('lp_settings')
export class LpSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brandId: number;

  @Column()
  status: boolean;

  @Column({ type: 'int', default: 1, nullable: false })
  noOfPages: number;

  @Column({ type: 'json', default: {}, nullable: false })
  templateConfig: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  createdBy: number;

  @Column()
  updatedBy: number;
}
