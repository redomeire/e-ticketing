"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { useFormContext, Controller } from "react-hook-form"
import { cn } from "@/lib/utils/cn"

interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  name?: string;
  withValidation?: boolean;
  label?: string;
}

function RadioGroup({
  className,
  name,
  withValidation,
  label,
  children,
  ...props
}: RadioGroupProps) {
  const useOptionalFormContext = () => {
    try {
      return useFormContext();
    } catch {
      return null;
    }
  };

  const form = useOptionalFormContext();
  if (!withValidation || !name || !form) {
    return (
      <div className="space-y-3">
        {label && <label className="text-sm font-black text-[#002558] uppercase tracking-tighter">{label}</label>}
        <RadioGroupPrimitive.Root
          data-slot="radio-group"
          className={cn("grid w-full gap-3", className)}
          {...props}
        >
          {children}
        </RadioGroupPrimitive.Root>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-black text-[#002558] uppercase tracking-tighter">{label}</label>}
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState: { error } }) => (
          <div className="space-y-2">
            <RadioGroupPrimitive.Root
              data-slot="radio-group"
              className={cn("grid w-full gap-3", className)}
              {...props}
              value={field.value?.toString()} // Pastikan string untuk Radix
              onValueChange={field.onChange}
            >
              {children}
            </RadioGroupPrimitive.Root>

            {error && (
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                {error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-5 shrink-0 rounded-full border border-slate-200 outline-none transition-all focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-full items-center justify-center"
      >
        <span className="size-2 rounded-full bg-white shadow-sm" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }