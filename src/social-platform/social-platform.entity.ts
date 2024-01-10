import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { SocialPlatforms } from './dtos/SocialPlatformDto';
import { User } from 'src/user/user.entity';

@Entity('social_platform')
export class SocialPlatform {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: false, nullable: true })
  user_id: number;

  @Column({
    type: 'enum',
    enum: SocialPlatforms,
  })
  type?: SocialPlatforms;

  @Column({ nullable: true })
  url: string;

  @ManyToOne(() => User, (user) => user.socialPlatforms)
  @JoinColumn()
  user: User;
}
