export interface PluginFile {
  path: string;
  name: string;
  category: 'CORE' | 'INCLUDES' | 'ADMIN' | 'CLIENT' | 'TEMPLATES' | 'ASSETS' | 'GAS' | 'DOCS' | 'PUBLIC' | 'SERVICES' | 'VIEWS';
  description: string;
  content: string;
}
