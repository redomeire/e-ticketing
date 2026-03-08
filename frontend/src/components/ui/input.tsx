"use client";

import * as React from "react"
import { cn } from "@/lib/utils/cn"
import { Controller, useFormContext } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "./field";
interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  withValidation?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

function BaseInput({ className, type, startIcon, endIcon, ...props }: InputProps) {
  return (
    <div className="relative w-full group/input">
      {startIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none transition-colors group-focus-within/input:text-ring">
          {startIcon}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "h-9 w-full min-w-0 rounded-4xl border border-input bg-input/30 py-1 text-base transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          startIcon ? "pl-10" : "px-3",
          endIcon ? "pr-10" : "px-3",
          className
        )}
        value={props.value !== undefined ? (props.value ?? "") : props.value}
        {...props}
      />
      {endIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none transition-colors group-focus-within/input:text-ring">
          {endIcon}
        </div>
      )}
    </div>
  )
}

const InputWithValidation = ({ label, ...props }: InputProps) => {
  const useOptionalFormContext = () => {
    try {
      return useFormContext();
    } catch {
      return null;
    }
  };
  const form = useOptionalFormContext();

  return (
    <Controller
      name={props.name as string}
      control={form?.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && (
            <FieldLabel htmlFor={props.id}>
              {label}
            </FieldLabel>
          )}
          <BaseInput
            {...field}
            {...props}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && fieldState.error && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  )
}

const Input = ({ withValidation = false, ...props }: InputProps) => {
  if (withValidation) {
    return <InputWithValidation {...props} />
  }
  return <BaseInput {...props} />
}

export { Input }