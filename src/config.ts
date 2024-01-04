import { AcfGeneratorConfig } from './modules/acf-generator/acf-generator.config.js';
import { CleanerConfig } from './modules/cleaner/cleaner.config.js';

export interface UserConfig {
  acfGenerator?: AcfGeneratorConfig;
  cleaner?: CleanerConfig;
}

/**
 * Type helper to make it easier to use cli config
 */
export default function defineConfig(config: UserConfig) {
  return config;
}

// export type ResolvedConfig = UserConfig & {};
