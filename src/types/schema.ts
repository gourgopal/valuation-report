export type FieldType = 'text' | 'number' | 'price' | 'select' | 'image' | 'date';

export interface SchemaAttribute {
  elementIdentifier: string;
  label: string;
  type: FieldType;
  required?: boolean;
  readonly?: boolean;
  calculationFormula?: string;
  value?: any;
  options?: { label: string; value: string | number }[]; // For select fields
}

export interface VisibilityRule {
  targetField: string;
  condition: string; // Evaluated dynamically, e.g., "PropertyType == 'Commercial'"
}

export interface FormSchema {
  templateId: string;
  domain: string;
  theme?: { primaryColor: string };
  attributes: SchemaAttribute[];
  visibilityRules?: VisibilityRule[];
}
