import chalk from 'chalk';
import { z } from 'zod';

export type StyleCssGeneratorOptions = {
  useRestricted?: boolean;
  dontOverwrite?: boolean;
  validateSchema?: boolean;
};

const allowedTags = z.enum([
  'grid-layout',
  'one-column',
  'two-columns',
  'three-columns',
  'four-columns',
  'left-sidebar',
  'right-sidebar',
  'wide-blocks',
  'accessibility-ready',
  'block-patterns',
  'block-styles',
  'buddypress',
  'custom-background',
  'custom-colors',
  'custom-header',
  'custom-logo',
  'custom-menu',
  'editor-style',
  'featured-image-header',
  'featured-images',
  'flexible-header',
  'footer-widgets',
  'front-page-post-form',
  'full-site-editing',
  'full-width-template',
  'microformats',
  'post-formats',
  'rtl-language-support',
  'sticky-post',
  'style-variations',
  'template-editing',
  'theme-options',
  'threaded-comments',
  'translation-ready',
  'blog',
  'e-commerce',
  'education',
  'entertainment',
  'food-and-drink',
  'holiday',
  'news',
  'photography',
  'portfolio',
]);

const alsoPkgField = (fieldName: string) =>
  `you might use ${chalk.green(fieldName)} property from package.json`;
const createStyleCssSchema = (restrictedTags: boolean = false) =>
  z.object({
    theme_name: z.string({
      required_error: `Theme name is required by WordPress, ${alsoPkgField('name')}.`,
    }),
    theme_uri: z
      .string({
        required_error: `Theme URI is required by WordPress, ${alsoPkgField('homepage')}.`,
      })
      .url('Theme URI must be a valid url.'),
    author: z.string({
      required_error: `Author is required by WordPress, ${alsoPkgField('author')}.`,
    }),
    author_uri: z
      .string({
        required_error: `Author URI is required by WordPress, ${alsoPkgField('author.url')}.`,
      })
      .url('Author URI must be a valid url.'),
    description: z.string({
      required_error: `Description is required by WordPress, ${alsoPkgField('description')}.`,
    }),
    version: z.string().optional(),
    requires_at_least: z
      .string({ required_error: "'Requires at least' is required by WordPress." })
      .regex(/^\d+\.\d+$/gm, 'Please provide WP version in X.X pattern.'),
    tested_up_to: z
      .string({ required_error: "'Tested up to' is required by WordPress." })
      .regex(/^\d+\.\d+$/gm, 'Please provide WP version in X.X pattern.'),
    requires_php: z
      .string({ required_error: "'Requires PHP' is required by WordPress." })
      .regex(/^\d+\.\d+$/gm, 'Please provide PHP version in X.X pattern.'),
    tags: restrictedTags
      ? allowedTags.optional()
      : z.string({ invalid_type_error: 'Tags must be an array of string.' }).array().optional(),
    license: z.string({
      required_error: `License is required by WordPress, ${alsoPkgField('license')}.`,
    }),
    license_uri: z.string().url('License URI must be a valid url.').optional(),
    text_domain: z.string({
      required_error: `Description is required by WordPress, ${alsoPkgField('name')}.`,
    }),
    domain_path: z.string().optional(),
    template: z.string().optional(),
  });

export const styleCssSchema = createStyleCssSchema();
export const styleCssSchemaWithRestrictedTagsSchema = createStyleCssSchema(true);

export type StyleCss = z.infer<typeof styleCssSchema>;
export type StyleCssSchemaWithRestrictedTags = z.infer<
  typeof styleCssSchemaWithRestrictedTagsSchema
>;

export const styleCssLabels: Record<keyof StyleCss, string> = {
  theme_name: 'Theme Name',
  theme_uri: 'Theme URI',
  author: 'Author',
  author_uri: 'Author URI',
  description: 'Description',
  version: 'Version',
  tags: 'Tags',
  requires_at_least: 'Requires at least',
  tested_up_to: 'Tested up to',
  requires_php: 'Requires PHP',
  license: 'License',
  license_uri: 'License URI',
  text_domain: 'Text Domain',
  domain_path: 'Domain Path',
  template: 'Template',
} as const;
