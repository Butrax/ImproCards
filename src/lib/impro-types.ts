export interface ImproCard {
  id: string;
  name: string;
  themeName: string;
  image: {
    imageUrl: string;
    description: string;
    imageHint: string;
  };
}

export interface ImproTheme {
  name: string;
  color: string;
  cards: ImproCard[];
}
