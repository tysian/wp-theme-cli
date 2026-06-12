export type AcfLayout = {
  key: string;
  label: string;
  name: string;
  display: string;
  sub_fields: AcfField[];
  [key: string]: any;
};

export type AcfField = {
  key: string;
  label: string;
  name: string;
  type: string;
  layouts?: Record<string, AcfLayout>;
  [key: string]: any;
  clone?: string[];
};

export type AcfGroup = {
  key: string;
  title: string;
  fields: AcfField[];
  [key: string]: any;
};

type ModuleDataSubfield = {
  name: string;
  variableName: string;
};
export type ModuleData = {
  name: string;
  namePascalCase: string;
  nameCamelCase: string;
  variableName: string;
  fileName: string;
  className: string;
  subfields: ModuleDataSubfield[];
};
