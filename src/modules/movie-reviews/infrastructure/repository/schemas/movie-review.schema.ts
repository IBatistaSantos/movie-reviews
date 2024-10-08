import { UserSchema } from '@/modules/users/infrastructure/repository/schemas/user.schema';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MovieSchema } from './movie.schema';

@Entity('movie_reviews')
export class MovieReviewSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  notes: string;

  @ManyToOne(() => UserSchema, (user) => user.reviews, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: UserSchema;

  @ManyToOne(() => MovieSchema, (movie) => movie.reviews, { eager: true })
  @JoinColumn({ name: 'movieId' })
  movie: MovieSchema;
}
