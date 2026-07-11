'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { FormSchema } from '@/types/schema';
import { DynamicField } from './DynamicField';
import { useDynamicFormEngine } from '@/hooks/useDynamicFormEngine';
import { Save } from 'lucide-react';

interface DynamicFormProps {
  schema: FormSchema;
  initialData?: any;
  onSave: (data: any) => void;
}

export function DynamicForm({ schema, initialData, onSave }: DynamicFormProps) {
  // Use uncontrolled form state for performance with 400+ fields
  const form = useForm({
    defaultValues: initialData || {},
    mode: 'onBlur',
  });

  const { handleSubmit, register, formState: { errors }, setValue } = form;
  
  // Attach our debounced calculation and visibility engine
  const { visibleFields } = useDynamicFormEngine(schema, form);

  return (
    <form onSubmit={handleSubmit(onSave)} className="w-full max-w-2xl bg-white shadow-sm border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
        <h2 className="text-xl font-semibold text-slate-800">
          {schema.domain.charAt(0).toUpperCase() + schema.domain.slice(1)} Assessment
        </h2>
        <button
          type="submit"
          className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save to Queue</span>
        </button>
      </div>

      <div className="space-y-2">
        {schema.attributes.map((attr) => (
          <DynamicField
            key={attr.elementIdentifier}
            attribute={attr}
            register={register}
            errors={errors}
            setValue={setValue}
            hidden={!visibleFields.has(attr.elementIdentifier)}
          />
        ))}
      </div>
    </form>
  );
}
