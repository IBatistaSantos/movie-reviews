export interface MovieProvider {
  title: string;
  year: string;
  actors: string;
  poster: string;
  released: string;
  genre: string;
  rating: number;
}

export interface SearchMovieProvider {
  search(title: string): Promise<MovieProvider | null>;
}
