import * as fs from 'fs';
import * as path from 'path';
import type { ImproCard, ImproTheme, ThemeConfig } from '@/lib/impro-types';

export const generateThemes = (): ImproTheme[] => {
  const cartesDirectory = path.join(process.cwd(), 'public', 'Cartes');
  const configFileName = 'theme.json';

  const defaultThemeColors = [
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
      .readdirSync(cartesDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    return themeDirectories.map(themeName => {
      const themePath = path.join(cartesDirectory, themeName);
      const configPath = path.join(themePath, configFileName);
      let config: ThemeConfig = {};
      
      try {
        if (fs.existsSync(configPath)) {
            const rawConfig = fs.readFileSync(configPath, 'utf-8');
            config = JSON.parse(rawConfig);
        }
      } catch (e) {
        console.error(`Could not parse ${configPath}`, e)
      }


      const allCardFiles = fs
        .readdirSync(themePath)
        .filter(file => /\.(jpeg|jpg|png|gif|bmp)$/i.test(file));
      
      const excludedCardsSet = new Set(config.excludedCards || []);
      const includedCardFiles = allCardFiles.filter(fileName => !excludedCardsSet.has(fileName));

      const themeNameFormatted =
        themeName.charAt(0).toUpperCase() + themeName.slice(1);

      const cards: ImproCard[] = includedCardFiles.map(fileName => {
        const cardName = path.parse(fileName).name.replace(/[-_]/g, ' ');
        const formattedCardName =
          cardName.charAt(0).toUpperCase() + cardName.slice(1);
        
        return {
          id: `${themeName}-${fileName}`,
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
      
      const themeColor = config.color || defaultThemeColors[colorIndex % defaultThemeColors.length];
      colorIndex++;

      const theme: ImproTheme = {
        name: themeNameFormatted,
        color: themeColor,
        cards: cards,
      };
      
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
