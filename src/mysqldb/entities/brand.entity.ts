import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'brand' })
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column()
  description: string;

  @Column()
  descriptor: string;

  @Column({ type: 'enum', enum: ['only_text', 'photo', 'photo_text', 'video'] })
  type: string;

  @Column({ type: 'enum', enum: ['upload', 'Vimeo', 'Youtube'] })
  video_type: string;

  @Column({ type: 'text' })
  image_video: string;

  @Column({ type: 'text' })
  image_url: string;

  @Column({ type: 'varchar', length: 11 })
  user_id: string;

  @Column({ type: 'int' })
  position: number;

  @Column({type: 'date', nullable: true})
  deleted_at: Date | null;
}
