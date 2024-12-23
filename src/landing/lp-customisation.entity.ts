import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('lp_customisation')
export class LpCustomisation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  landingPageId: number;

  @Column()
  sectionId: number;

  @Column('json')
  content: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  createdBy: number;

  @Column()
  updatedBy: number;
}
