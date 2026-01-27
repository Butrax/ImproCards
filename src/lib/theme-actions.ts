'use server';

import * as fs from 'fs/promises';
import * as path from 'path';
import type { ManagedTheme, ThemeConfig } from './impro-types';

const cartesDirectory = path.join(process.cwd(), 'public', 'Cartes');
const configFileName = 'theme.json';

// Action to get all themes and their configs for the management UI
export async function getThemesForManager(): Promise<ManagedTheme[]> {
  try {
    const themeDirectories = (
      await fs.readdir(cartesDirectory, { withFileTypes: true })
    )
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    const managedThemes = await Promise.all(
      themeDirectories.map(async (themeName) => {
        const themePath = path.join(cartesDirectory, themeName);
        const configPath = path.join(themePath, configFileName);
        let config: ThemeConfig = {};

        try {
          const rawConfig = await fs.readFile(configPath, 'utf-8');
          config = JSON.parse(rawConfig);
        } catch (error) {
          // Config file doesn't exist or is invalid, use defaults
        }

        const cardFiles = (await fs.readdir(themePath)).filter((file) =>
          /\.(jpeg|jpg|png|gif|bmp)$/i.test(file)
        );

        const themeNameFormatted =
          themeName.charAt(0).toUpperCase() + themeName.slice(1);

        return {
          name: themeNameFormatted,
          config: {
            color: config.color,
          },
          allCards: cardFiles,
        };
      })
    );

    return managedThemes;
  } catch (error) {
    console.error("Error getting themes for manager:", error);
    return [];
  }
}
