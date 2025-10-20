import type { AcfGeneratorConfig } from './modules/acf-generator/acf-generator.config.js';
import type { CleanerConfig } from './modules/cleaner/cleaner.config.js';
import fastGlob from 'fast-glob';
import { DEFAULT_CONFIGS_DIR } from './constants.js';
import { logger } from './shared/utils/log/logger.js';

export interface UserConfig {
  // generator?: {
  //   acfFlexibleField: AcfGeneratorConfig;
  // };
  cleaner?: CleanerConfig;
}

// export type ResolvedConfig = UserConfig & {};

/**
 * Type helper to make it easier to use cli config
 */
export function defineConfig(config: UserConfig) {
  return config;
}

export async function loadCliConfig() {}

export function validateConfig() {}

export async function findDeprecatedConfig() {
  const deprecatedConfigs = await fastGlob(
    `${DEFAULT_CONFIGS_DIR}/*.{cleaner-config,acf-generator-config}.json`,
    { onlyFiles: true }
  );

  if (!deprecatedConfigs.length) return;

  logger.deprecated(
    `You are using old configuration via json files, which is no longed supported. Read more about migrating at https://github.com/tysian/wp-theme-cli#configuration`
  );
}
