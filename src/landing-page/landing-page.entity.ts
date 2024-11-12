import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('landing_page')
export class LandingPage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brandId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('json')
  content: any;

  @Column()
  createdBy: number;

  @Column()
  updatedBy: number;
}
