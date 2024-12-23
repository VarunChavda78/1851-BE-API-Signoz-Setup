import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('lp_template_pages')
export class LpTemplatePage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  templateId: number;

  @Column({ length: 255 })
  name: string;

  @Column()
  sequence: number;

  @Column()
  createdBy: number;

  @Column()
  updatedBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
