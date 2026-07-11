import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { SchemaAttribute } from '@/types/schema';
import clsx from 'clsx';
import imageCompression from 'browser-image-compression';

interface DynamicFieldProps {
  attribute: SchemaAttribute;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  setValue: UseFormSetValue<any>;
  hidden?: boolean;
}

export function DynamicField({ attribute, register, errors, setValue, hidden }: DynamicFieldProps) {
  if (hidden) return null;

  const { elementIdentifier, label, type, required, readonly } = attribute;
  const error = errors[elementIdentifier];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      // In a real app, you might upload this immediately or convert to base64 for offline storage
      // For now, we store the file object or a local blob URL
      const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
      setValue(elementIdentifier, base64, { shouldDirty: true });
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };

  const inputClass = clsx(
    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm",
    error ? "border-red-500" : "border-slate-300",
    readonly && "bg-slate-50 text-slate-500 cursor-not-allowed"
  );

  return (
    <div className="flex flex-col space-y-1 mb-4">
      <label htmlFor={elementIdentifier} className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === 'text' && (
        <input
          id={elementIdentifier}
          type="text"
          readOnly={readonly}
          {...register(elementIdentifier, { required })}
          className={inputClass}
        />
      )}

      {(type === 'number' || type === 'price') && (
        <div className="relative">
          {type === 'price' && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">$</span>
          )}
          <input
            id={elementIdentifier}
            type="number"
            step="any"
            readOnly={readonly}
            {...register(elementIdentifier, { required, valueAsNumber: true })}
            className={clsx(inputClass, type === 'price' && "pl-7")}
          />
        </div>
      )}

      {type === 'select' && (
        <select
          id={elementIdentifier}
          {...register(elementIdentifier, { required })}
          className={inputClass}
          disabled={readonly}
        >
          <option value="">Select an option...</option>
          {attribute.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {type === 'image' && (
        <input
          id={elementIdentifier}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className={clsx(
            "file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold",
            "file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100",
            inputClass
          )}
        />
      )}

      {error && <span className="text-xs text-red-500">This field is required</span>}
    </div>
  );
}
