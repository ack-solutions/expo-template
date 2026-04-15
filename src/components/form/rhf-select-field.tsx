import {
  AppSelect,
  type SelectOption,
  type SelectSize,
  type SelectVariant,
} from '@/components/ui';
import React from 'react';
import {
 Control, Controller, FieldPath, FieldValues 
} from 'react-hook-form';
import { ViewStyle } from 'react-native';

export type RHFSelectFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  hint?: string;
  variant?: SelectVariant;
  size?: SelectSize;
  disabled?: boolean;
  searchable?: boolean;
  sheetTitle?: string;
  searchPlaceholder?: string;
  mode?: 'sheet' | 'dialog';
  containerStyle?: ViewStyle;
  mapErrorMessage?: (message: string) => string;
};

export function RHFSelectField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  mapErrorMessage,
  ...props
}: RHFSelectFieldProps<TFieldValues, TName>) {
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
          <AppSelect
            {...props}
            value={typeof field.value === 'string' ? field.value : ''}
            onChange={(option) => field.onChange(option.value)}
            error={mappedError}
          />
        );
      }}
    />
  );
}
