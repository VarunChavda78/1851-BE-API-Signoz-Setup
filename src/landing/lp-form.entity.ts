import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('lp_form')
export class LpForm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  brandId: number;

  @Column({ type: 'int' })
  lpId: number;

  @Column({ type: 'text' })
  content: string;
}
