import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('lp_inquiry')
export class LpInquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'lpId' })
  lpId: number;

  @Column({ type: 'int', name: 'brandId' })
  brandId: number;

  @Column({ type: 'text', name: 'email' })
  email: string;
}
