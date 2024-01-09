import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SocialPlatforms } from './dtos/SocialPlatformDto';

@Entity('social_platform')
export class SocialPlatform {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @Column({ unique: false, nullable: true })
  user_id: number;

  @Column({
    type: 'enum',
    enum: SocialPlatforms,
  })
  type?: SocialPlatforms;

  @Column({ nullable: true })
  url: string;
}
