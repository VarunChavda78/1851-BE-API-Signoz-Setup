import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('lp_status')
export class LpStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  landingPageId: number;

  @Column()
  status: number;

  @Column()
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;
}
