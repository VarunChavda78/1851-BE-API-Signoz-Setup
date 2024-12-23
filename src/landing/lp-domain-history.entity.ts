import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('lp_domain_history')
export class LpDomainHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  landingPageId: number;

  @Column({ nullable: true })
  domainType: number;

  @Column({ length: 255, nullable: true })
  domain: string;

  @Column()
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;
}
