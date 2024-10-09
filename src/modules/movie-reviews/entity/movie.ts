import { BaseEntity, BaseEntityProps } from '@/core/entity/base-entity';

export interface MovieProps extends BaseEntityProps {
  title: string;
  year: string;
  actors: string;
  poster: string;
  released: string;
  genre: string;
  director: string;
  rating: number;
}

export class Movie extends BaseEntity {
  private _title: string;
  private _year: string;
  private _actors: string;
  private _released: string;
  private _genre: string;
  private _poster: string;
  private _director: string;
  private _rating: number;

  constructor(props: MovieProps) {
    super(props);
    this._title = props.title;
    this._actors = props.actors;
    this._director = props.director;
    this._poster = props.poster;
    this._genre = props.genre;
    this._year = props.year;
    this._rating = props.rating;
    this._released = props.released;
  }

  get title() {
    return this._title;
  }

  get actors() {
    return this._actors;
  }

  get year() {
    return this._year;
  }

  get poster() {
    return this._poster;
  }

  get genre() {
    return this._genre;
  }

  get director() {
    return this._director;
  }

  get released() {
    return this._released;
  }

  get rating() {
    return this._rating;
  }

  toJSON(): MovieProps {
    return {
      ...super.toJSON(),
      title: this._title,
      actors: this._actors,
      rating: this._rating,
      director: this._director,
      released: this._released,
      year: this._year,
      poster: this._poster,
      genre: this._genre,
    };
  }
}
