import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column({ nullable: true })
  url: string;

  @Column()
  type: string;
}
