import chalk from 'chalk';
import { logger, loggerMergeMessages } from '$/shared/utils/index.js';
import { AcfField, AcfGroup } from '$/types.js';
import { loadAcfJsonFile } from '$/modules/acf-generator/helpers/loadAcfJsonFile.js';
import { getAcfGroupFields } from '$/modules/acf-generator/helpers/getAcfGroupFields.js';

const moduleGroupsCache = new Map<string, AcfGroup>();

export const resolveSubfields = async ({
  fields,
  modulesDirectory,
  layoutName,
}: {
  fields: AcfField[];
  modulesDirectory: string;
  layoutName: string;
}): Promise<AcfField[]> => {
  const resolved: AcfField[] = [];

  for (const subfield of fields) {
    if (!subfield || !subfield.name) continue;

    if (subfield.type === 'clone' && subfield.display === 'seamless') {
      if (!subfield.clone || !Array.isArray(subfield.clone) || subfield.clone.length === 0) {
        continue;
      }

      for (const key of subfield.clone) {
        if (!key || !key.startsWith('group_')) {
          logger.skip(
            loggerMergeMessages([
              `Clone field '${chalk.green(key)}' in field`,
              `'${chalk.green(layoutName)}' -> '${chalk.green(subfield.name)}'`,
              `is not supported and will be skipped.`,
            ])
          );
          continue;
        }

        let groupJson: AcfGroup | null;
        if (moduleGroupsCache.has(key)) {
          groupJson = moduleGroupsCache.get(key)!;
        } else {
          groupJson = await loadAcfJsonFile<AcfGroup>(modulesDirectory, key);
          if (groupJson) moduleGroupsCache.set(key, groupJson);
        }
        const groupFields = getAcfGroupFields(groupJson);
        if (groupFields.length === 0) continue;
        resolved.push(
          ...(await resolveSubfields({
            fields: groupFields,
            modulesDirectory,
            layoutName,
          }))
        );
      }
    } else {
      resolved.push(subfield);
    }
  }

  return resolved;
};
