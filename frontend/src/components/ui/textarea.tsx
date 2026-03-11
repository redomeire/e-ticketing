import * as React from "react"

import { cn } from "@/lib/utils/cn"
import { useFormContext, Controller } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "./field";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string
  withValidation?: boolean
}

function BaseTextarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full resize-none rounded-xl border border-input bg-input/30 px-3 py-3 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

const TextAreaWithValidation = ({ label, ...props }: TextareaProps) => {
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
          <BaseTextarea
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

function Textarea({ withValidation, ...props }: TextareaProps) {
  if (withValidation) {
    return <TextAreaWithValidation {...props} />
  }
  return <BaseTextarea {...props} />
}

export { Textarea }
