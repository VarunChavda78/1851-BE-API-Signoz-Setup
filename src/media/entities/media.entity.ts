import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MediaTypes } from '../dtos/mediaDto';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column({ nullable: true })
  url: string;

  @Column({
    type: 'enum',
    enum: MediaTypes,
  })
  type: MediaTypes;
}
