import { MovieReviewSchema } from '@/modules/movie-reviews/infrastructure/repository/schemas/movie-review.schema';
import { MovieSchema } from '@/modules/movie-reviews/infrastructure/repository/schemas/movie.schema';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserSchema {
  @PrimaryColumn({
    primary: true,
  })
  id: string;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  status: string;

  @Column({ default: null })
  forgotPasswordToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => MovieReviewSchema, (review) => review.user)
  reviews: MovieSchema[];
}
