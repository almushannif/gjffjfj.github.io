import { PluginFile } from './pluginTypes';
import { PLUGIN_NOTARY_CORE_FILES } from './pluginNotaryCore';
import { PLUGIN_NOTARY_INCLUDES_FILES } from './pluginNotaryIncludes';
import { PLUGIN_NOTARY_ADMIN_FILES } from './pluginNotaryAdmin';
import { PLUGIN_NOTARY_CLIENT_FILES } from './pluginNotaryClient';
import { PLUGIN_NOTARY_TEMPLATES_ASSETS_FILES } from './pluginNotaryTemplatesAssets';
import { PLUGIN_NOTARY_GAS_FILES } from './pluginNotaryGas';

export * from './pluginTypes';

// Combine all Lalu Daud Notary & PPAT WordPress plugin & GAS files into a single unified array
export const WORDPRESS_PLUGIN_FILES: PluginFile[] = [
  ...PLUGIN_NOTARY_CORE_FILES,
  ...PLUGIN_NOTARY_INCLUDES_FILES,
  ...PLUGIN_NOTARY_ADMIN_FILES,
  ...PLUGIN_NOTARY_CLIENT_FILES,
  ...PLUGIN_NOTARY_TEMPLATES_ASSETS_FILES,
  ...PLUGIN_NOTARY_GAS_FILES,
];

