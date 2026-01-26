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

// New types for management
export interface ThemeConfig {
  color?: string;
  excludedCards?: string[];
}

// This will be the data structure for the management UI
export interface ManagedTheme {
  name: string;
  config: ThemeConfig;
  allCards: string[]; // Just file names like 'card1.jpeg'
}
