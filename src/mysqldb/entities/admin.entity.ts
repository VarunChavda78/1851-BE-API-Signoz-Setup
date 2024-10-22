import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'admin' })
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  uuid: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  last_name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  company: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  user_name: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'superadmin'],
    nullable: false,
  })
  type: string;

  @Column({ type: 'date', nullable: false })
  registration_date: Date;

  @Column({
    type: 'enum',
    enum: ['md5', 'sha1'],
    default: 'md5',
    nullable: false,
  })
  pass_type: string;

  @Column({ type: 'date', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_date: Date;

  @Column({ type: 'text', nullable: false })
  photo: string;

  @Column({ type: 'varchar', length: 12 })
  login_token: string;

  @Column({ type: 'varchar', length: 200 })
  access_token: string;

  @Column({ type: 'varchar', length: 255 })
  signinToken: string;
}
