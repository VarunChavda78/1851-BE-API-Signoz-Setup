import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ga_location_metrics' })
export class MysqlGALocationMetrics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  brand_id: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  state: string;

  @Column({ type: 'int' })
  views: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  session_duration: number;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  avg_session_duration: number;

  @Column({ type: 'int' })
  sessions: number;

  @Column({ type: 'text', nullable: true })
  latitude: string;

  @Column({ type: 'text', nullable: true })
  longitude: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'int' })
  unique_users: number;
}
