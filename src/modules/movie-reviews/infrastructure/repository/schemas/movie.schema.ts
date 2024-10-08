import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MovieReviewSchema } from './movie-review.schema';

@Entity('movies')
export class MovieSchema {
  @PrimaryColumn({
    primary: true,
  })
  id: string;

  @Column()
  title: string;

  @Column()
  year: string;

  @Column()
  actors: string;

  @Column()
  poster: string;

  @Column()
  released: string;

  @Column()
  genre: string;

  @Column()
  rating: number;

  @Column({
    default: 'ACTIVE',
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => MovieReviewSchema, (review) => review.movie)
  reviews: MovieReviewSchema[];
}
