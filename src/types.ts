export interface AcfLayout {
  key: string;
  label: string;
  name: string;
  display: string;
  sub_fields: AcfField[];
  [key: string]: any;
}

export interface AcfField {
  key: string;
  label: string;
  name: string;
  type: string;
  layouts?: Record<string, AcfLayout>;
  [key: string]: any;
}

export interface AcfGroup {
  key: string;
  title: string;
  fields: AcfField[];
  [key: string]: any;
}
