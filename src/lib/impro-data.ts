import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export interface ImproCard {
  id: string;
  name: string;
  themeName: string;
  image: ImagePlaceholder;
}

export interface ImproTheme {
  name: string;
  color: string;
  cards: ImproCard[];
}

const getImage = (id: string): ImagePlaceholder => {
  const img = PlaceHolderImages.find((p) => p.id === id);
  if (!img) {
    throw new Error(`Image with id ${id} not found.`);
  }
  return img;
};

export const themes: ImproTheme[] = [
  {
    name: 'Lieux',
    color: 'hsl(50, 85%, 80%)',
    cards: [
      { id: 'lieux-1', name: 'Plage Tropicale', themeName: 'Lieux', image: getImage('lieux-1') },
      { id: 'lieux-2', name: 'Ville Futuriste', themeName: 'Lieux', image: getImage('lieux-2') },
      { id: 'lieux-3', name: 'Forêt Enchantée', themeName: 'Lieux', image: getImage('lieux-3') },
      { id: 'lieux-4', name: 'Manoir Hanté', themeName: 'Lieux', image: getImage('lieux-4') },
    ],
  },
  {
    name: 'Personnages',
    color: 'hsl(190, 85%, 80%)',
    cards: [
      { id: 'personnages-1', name: 'Détective Privé', themeName: 'Personnages', image: getImage('personnages-1') },
      { id: 'personnages-2', name: 'Pirate de l\'Espace', themeName: 'Personnages', image: getImage('personnages-2') },
      { id: 'personnages-3', name: 'Reine Médiévale', themeName: 'Personnages', image: getImage('personnages-3') },
      { id: 'personnages-4', name: 'Savant Fou', themeName: 'Personnages', image: getImage('personnages-4') },
    ],
  },
  {
    name: 'Objets',
    color: 'hsl(300, 85%, 85%)',
    cards: [
      { id: 'objets-1', name: 'Boussole Magique', themeName: 'Objets', image: getImage('objets-1') },
      { id: 'objets-2', name: 'Journal Intime Ancien', themeName: 'Objets', image: getImage('objets-2') },
      { id: 'objets-3', name: 'Clé Mystérieuse', themeName: 'Objets', image: getImage('objets-3') },
      { id: 'objets-4', name: 'Robot Défectueux', themeName: 'Objets', image: getImage('objets-4') },
    ],
  },
];
