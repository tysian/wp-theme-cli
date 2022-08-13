import chalk from 'chalk';

export const deleteInACFModulesJSON = (acfModulesGroup, acfModulesToRemove = []) => {
  const outputObject = JSON.parse(JSON.stringify(acfModulesGroup));
  const acfModulesIndex = outputObject.fields.findIndex((field) => field.name === 'modules');
  const acfModule = acfModulesIndex > -1 ? outputObject.fields[acfModulesIndex] : null;

  try {
    if (acfModule && acfModule?.type === 'flexible_content' && acfModule?.layouts) {
      const removeKeys = Object.values(acfModule.layouts).filter((l) =>
        acfModulesToRemove.includes(l.name)
      );

      removeKeys.forEach(({ key }) => {
        if (outputObject?.fields?.[acfModulesIndex]?.layouts?.[key]) {
          delete outputObject.fields[acfModulesIndex].layouts[key];
        } else {
          throw new Error(`fields[${acfModulesIndex}].layouts[${key}] not found.`);
        }
      });
    } else {
      throw new Error('No flexible_content module field.');
    }
  } catch (errorMessage) {
    console.log(`${chalk.red('[Callback Error]')}: ${errorMessage}.`);
  }

  return outputObject;
};
