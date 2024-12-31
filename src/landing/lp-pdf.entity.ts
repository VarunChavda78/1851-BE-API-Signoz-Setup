import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('lp_pdf')
export class LpPdf {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brandId: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ length: 255, unique: true })
  email: string;
}
