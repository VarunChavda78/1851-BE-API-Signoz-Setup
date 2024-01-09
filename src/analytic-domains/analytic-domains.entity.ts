import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('analytic_domains')
export class AnalyticDomains {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @Column({ unique: false, nullable: true })
  user_id: number;

  @Column({ nullable: true })
  domain: string;
}
