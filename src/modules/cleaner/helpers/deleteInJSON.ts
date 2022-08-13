export const deleteInJSON = (_property = [], json) => {
  const jsonFile = JSON.parse(JSON.stringify(json));
  const propertyArray = ['jsonFile', ..._property].map((prop, index) =>
    index > 0 ? `['${prop}']` : prop
  );

  const property = propertyArray.join('');
  const propertyExists = propertyArray.join('?.');

  if (eval(propertyExists)) {
    delete eval(`delete ${property}`);
  }

  return jsonFile;
};
