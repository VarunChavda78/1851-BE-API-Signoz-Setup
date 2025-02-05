import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity('lp_leads')
@Index(['uid'])
export class LpLeads {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  brandId: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  lpId: number;

  @Column({
    type: 'varchar',
    length: 36,
    nullable: false,
  })
  uid: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  field: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  value: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: 'Type identifier for the lead',
  })
  type: number;

  //   1 = lead, 2 = download
  @Column({
    type: 'int',
    nullable: true,
  })
  formType: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;
}
