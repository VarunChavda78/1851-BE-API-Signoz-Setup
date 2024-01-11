import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('analytic_domains')
export class AnalyticDomains {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  object_id: number;

  @Column()
  object_type: number;

  @Column()
  domain: string;
}
