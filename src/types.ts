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
  display?: 'seamless' | 'group';
};

export type AcfGroup = {
  key: string;
  title: string;
  fields: AcfField[];
  [key: string]: any;
};

type ModuleDataSubfield = {
  /** Subfield key */
  name: string;
  /** Subfield key in snake_case */
  variableName: string;
};
export type ModuleData = {
  /** Layout name */
  name: string;
  /** Layout name in PascalCase */
  namePascalCase: string;
  /** Layout name in camelCase */
  nameCamelCase: string;
  /** Layout name in snake_case */
  variableName: string;
  /** File name with extension */
  fileName: string;
  /** Layout name in kebab-case */
  className: string;
  /** Array of layout subfields */
  subfields: ModuleDataSubfield[];
};
