export class Game {
  id?: string | number;
  name?: string;
  slug?: string;
  image?: any;
  logo?: string;
  banner?: string;

  constructor(data?: Partial<Game>) {
    Object.assign(this, data);
  }
}
