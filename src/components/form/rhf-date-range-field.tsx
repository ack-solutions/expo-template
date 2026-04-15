import {
  AppDateRangePicker,
  type AppDateRangePickerProps,
} from '@/components/ui';
import React from 'react';
import {
 Control, Controller, FieldPath, FieldValues 
} from 'react-hook-form';

type DateRangeValue = AppDateRangePickerProps['value'];

export type RHFDateRangeFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  mapErrorMessage?: (message: string) => string;
} & Omit<AppDateRangePickerProps, 'value' | 'onChange' | 'error'>;

const emptyRange: DateRangeValue = {
  startDate: null,
  endDate: null,
};

function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

function normalizeRange(value: unknown): DateRangeValue {
  if (!value || typeof value !== 'object') return emptyRange;
  const maybeRange = value as Partial<DateRangeValue>;
  return {
    startDate: isDate(maybeRange.startDate) ? maybeRange.startDate : null,
    endDate: isDate(maybeRange.endDate) ? maybeRange.endDate : null,
  };
}

export function RHFDateRangeField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  mapErrorMessage,
  ...props
}: RHFDateRangeFieldProps<TFieldValues, TName>) {
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

        return (
          <AppDateRangePicker
            {...props}
            value={normalizeRange(field.value)}
            onChange={field.onChange}
            error={mappedError}
          />
        );
      }}
    />
  );
}
