import { Entity, PrimaryGeneratedColumn, Column,ManyToOne ,JoinColumn} from 'typeorm';
import {Registration} from './registration.entity'

@Entity('site_log') 
export class SiteLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brandId: number;

  @Column({ type: 'date' })
  loginDate: string;

  @Column({ type: 'datetime' })
  loginTime: Date;

  @Column({ type: 'datetime' })
  logoutTime: Date;

  @Column({ type: 'time' })
  totalTime: string;

  @Column({
    type: 'enum',
    enum: ['user', 'author', 'admin', 'user_author'],
  })
  type: string;

  @Column({ type: 'tinyint' })
  is_impersonate: boolean;

}
