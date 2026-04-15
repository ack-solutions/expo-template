import { AppInput, type InputSize, type InputVariant } from '@/components/ui';
import React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { ViewStyle } from 'react-native';

export type RHFInputFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  placeholder?: string;
  hint?: string;
  variant?: InputVariant;
  size?: InputSize;
  editable?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad';
  containerStyle?: ViewStyle;
  mapErrorMessage?: (message: string) => string;
};

export function RHFInputField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  name,
  mapErrorMessage,
  ...props
}: RHFInputFieldProps<TFieldValues, TName>) {
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
          <AppInput
            {...props}
            value={typeof field.value === 'string' ? field.value : ''}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={mappedError}
          />
        );
      }}
    />
  );
}
