import {
  AppDatePicker,
  type AppDatePickerProps,
} from '@/components/ui';
import React from 'react';
import {
 Control, Controller, FieldPath, FieldValues 
} from 'react-hook-form';

function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export type RHFDateFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  mapErrorMessage?: (message: string) => string;
} & Omit<AppDatePickerProps, 'value' | 'onChange' | 'error'>;

export function RHFDateField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  mapErrorMessage,
  ...props
}: RHFDateFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const rawError = fieldState.error?.message;
        const mappedError =
          typeof rawError === 'string' && rawError.length > 0
            ? mapErrorMessage
              ? mapErrorMessage(rawError)
              : rawError
            : undefined;

        const value = isDate(field.value) ? field.value : null;

        return (
          <AppDatePicker
            {...props}
            value={value}
            onChange={field.onChange}
            error={mappedError}
          />
        );
      }}
    />
  );
}
