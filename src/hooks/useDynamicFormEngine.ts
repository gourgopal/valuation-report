import { useState, useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormSchema } from '@/types/schema';
import * as math from 'mathjs';

export function useDynamicFormEngine(schema: FormSchema, form: UseFormReturn<any>) {
  const [visibleFields, setVisibleFields] = useState<Set<string>>(
    new Set(schema.attributes.map(a => a.elementIdentifier))
  );
  
  const { watch, getValues, setValue } = form;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const evaluateRulesAndMath = () => {
    const currentValues = getValues();
    
    // Create custom math instance for CONVERT function
    const customMath = math.create(math.all, {});
    customMath.import({
      CONVERT: function (val: any) {
        return Number(val) || 0;
      }
    }, { override: true });

    // Populate scope with current form values
    const scope: Record<string, any> = { ...currentValues };
    
    // 1. Evaluate calculations
    schema.attributes.forEach((attr) => {
      if (attr.calculationFormula && attr.readonly) {
        try {
          const result = customMath.evaluate(attr.calculationFormula, scope);
          // Only trigger setValue if the value actually changed to avoid infinite loops
          if (currentValues[attr.elementIdentifier] !== result && !isNaN(result)) {
             setValue(attr.elementIdentifier, result, { shouldDirty: true });
             scope[attr.elementIdentifier] = result; // Update scope for chained calculations
          }
        } catch (error) {
          // Silently fail if formula cannot be evaluated yet (e.g. missing inputs)
        }
      }
    });

    // 2. Evaluate visibility rules
    if (schema.visibilityRules && schema.visibilityRules.length > 0) {
      const newVisible = new Set(schema.attributes.map(a => a.elementIdentifier));
      
      schema.visibilityRules.forEach(rule => {
        try {
           // We evaluate the condition against the same scope. 
           // E.g., "PropertyType == 'Commercial'"
           const conditionResult = customMath.evaluate(rule.condition, scope);
           
           // If condition evaluates to false, we hide the target field
           if (!conditionResult) {
             newVisible.delete(rule.targetField);
           }
        } catch (error) {
           // On error, we assume the condition is false or we hide it.
           // E.g. field doesn't exist yet. Let's hide it safely.
           newVisible.delete(rule.targetField);
        }
      });
      
      // Update state only if changed to prevent unnecessary re-renders
      setVisibleFields(prev => {
        if (prev.size !== newVisible.size) return newVisible;
        let isSame = true;
        for (let item of prev) {
          if (!newVisible.has(item)) {
            isSame = false;
            break;
          }
        }
        return isSame ? prev : newVisible;
      });
    }
  };

  useEffect(() => {
    // Initial evaluation on mount
    evaluateRulesAndMath();

    // Subscribe to form changes without triggering component re-renders
    const subscription = watch(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      
      // Debounce the calculation by 750ms
      timerRef.current = setTimeout(() => {
        evaluateRulesAndMath();
      }, 750);
    });
    
    return () => {
      subscription.unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [schema, watch]); // We only bind this once

  return { visibleFields };
}
