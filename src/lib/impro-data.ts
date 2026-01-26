import * as fs from 'fs';
import * as path from 'path';
import type { ImproCard, ImproTheme } from '@/lib/impro-types';

export const generateThemes = (): ImproTheme[] => {
  const cartesDirectory = path.join(process.cwd(), 'public', 'Cartes');

  const themeColors = [
    'hsl(50, 85%, 80%)',
    'hsl(190, 85%, 80%)',
    'hsl(300, 85%, 85%)',
    'hsl(20, 85%, 80%)',
    'hsl(250, 85%, 85%)',
    'hsl(100, 85%, 80%)',
  ];
  let colorIndex = 0;

  try {
    if (!fs.existsSync(cartesDirectory)) {
      console.warn(
        "Le dossier 'public/Cartes' n'existe pas. Aucune carte ne sera chargée."
      );
      return [];
    }

    const themeDirectories = fs
      .readdirSync(cartesDirectory, {withFileTypes: true})
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    return themeDirectories.map(themeName => {
      const themePath = path.join(cartesDirectory, themeName);
      
      const cardFiles = fs
        .readdirSync(themePath)
        .filter(file => /\.(jpeg|jpg|png)$/i.test(file));

      const themeNameFormatted =
        themeName.charAt(0).toUpperCase() + themeName.slice(1);

      const cards: ImproCard[] = cardFiles.map(fileName => {
        const cardName = path.parse(fileName).name.replace(/[-_]/g, ' ');
        const formattedCardName =
          cardName.charAt(0).toUpperCase() + cardName.slice(1);
        
        return {
          id: `${themeName}-${cardName.replace(/\s+/g, '-').toLowerCase()}`,
          name: formattedCardName,
          themeName: themeNameFormatted,
          image: {
            imageUrl: `/Cartes/${themeName}/${fileName}`,
            description: formattedCardName,
            imageHint: formattedCardName
              .toLowerCase()
              .split(' ')
              .slice(0, 2)
              .join(' '),
          },
        };
      });

      const theme: ImproTheme = {
        name: themeNameFormatted,
        color: themeColors[colorIndex % themeColors.length],
        cards: cards,
      };
      colorIndex++;
      return theme;
    });
  } catch (error) {
    console.error(
      "Erreur lors de la lecture des thèmes depuis le dossier:",
      error
    );
    return [];
  }
};
