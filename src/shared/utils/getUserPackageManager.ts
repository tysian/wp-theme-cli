export type PackageManager = 'npm' | 'pnpm' | 'yarn';

/**
 *
 * Credit: [create-t3-app](https://github.com/t3-oss/create-t3-app/blob/main/cli/src/installers/index.ts)
 * @returns {PackageManager} returns current package manager
 */
export const getUserPackageManager: () => PackageManager = () => {
  // This environment variable is set by npm and yarn but pnpm seems less consistent
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent?.startsWith('yarn')) return 'yarn';
  if (userAgent?.startsWith('pnpm')) return 'pnpm';

  return 'npm';
};
