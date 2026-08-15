import { ThemeFile } from '../types';
import { THEME_FILES_PART_1 } from './themeFilesPart1';
import { THEME_FILES_PART_2 } from './themeFilesPart2';
import { THEME_FILES_PART_3 } from './themeFilesPart3';
import { WORDPRESS_GOOGLE_INTEGRATION_FILES, GOOGLE_APPS_SCRIPT_FILES } from './googleIntegrationData';

const GAS_AS_THEME_FILES: ThemeFile[] = GOOGLE_APPS_SCRIPT_FILES.map((f) => ({
  path: f.path,
  name: f.name,
  description: f.description,
  content: f.code,
  language: 'javascript'
}));

export const NOTARY_THEME_FILES: ThemeFile[] = [
  ...THEME_FILES_PART_1,
  ...THEME_FILES_PART_2,
  ...THEME_FILES_PART_3,
  ...WORDPRESS_GOOGLE_INTEGRATION_FILES,
  ...GAS_AS_THEME_FILES,
];
