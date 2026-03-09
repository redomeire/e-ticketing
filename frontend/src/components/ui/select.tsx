"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "radix-ui"
import { cn } from "@/lib/utils/cn"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UnfoldMoreIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { Controller, useFormContext } from "react-hook-form"
import { Field, FieldError, FieldLabel } from "./field"

interface ExtendedSelectProps extends React.ComponentProps<typeof SelectPrimitive.Root> {
  withValidation?: boolean
  label?: string
  startIcon?: React.ReactNode
  placeholder?: string
  name?: string
}

function Select({ children, ...props }: ExtendedSelectProps) {
  if (props.withValidation) {
    return <SelectWithValidation {...props}>{children}</SelectWithValidation>
  }
  return <SelectPrimitive.Root data-slot="select" {...props}>{children}</SelectPrimitive.Root>
}

function SelectTrigger({
  className,
  children,
  startIcon,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  startIcon?: React.ReactNode
}) {
  return (
    <div className="relative w-full group/select">
      {startIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none transition-colors group-focus-within/select:text-blue-600 z-10">
          {startIcon}
        </div>
      )}
      <SelectPrimitive.Trigger
        className={cn(
          "flex h-12 w-full items-center justify-between gap-2 rounded-xl border border-input bg-gray-50 px-3 py-1 text-base transition-all outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm relative",
          startIcon ? "pl-10" : "pl-4",
          "pr-10",
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2 truncate">
          {children}
        </div>

        <SelectPrimitive.Icon asChild>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <HugeiconsIcon
              icon={UnfoldMoreIcon}
              className="size-5 text-gray-300 transition-colors group-focus-within/select:text-blue-600"
            />
          </div>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    </div>
  )
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "relative z-100 min-w-(--radix-select-trigger-width) overflow-hidden rounded-2xl bg-white text-popover-foreground shadow-2xl ring-1 ring-black/5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          position === "popper" && "translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport className="p-2">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-pointer items-center rounded-xl py-3 pl-4 pr-10 text-sm font-medium outline-none transition-colors focus:bg-blue-50 focus:text-blue-700 data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-4 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <HugeiconsIcon icon={Tick02Icon} className="size-4 text-blue-600" strokeWidth={2.5} />
        </SelectPrimitive.ItemIndicator>
      </span>
    </SelectPrimitive.Item>
  )
}

function SelectWithValidation({ label, name, children, ...props }: ExtendedSelectProps) {
  const form = useFormContext();
  return (
    <Controller
      name={name as string}
      control={form?.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && (
            <FieldLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">
              {label}
            </FieldLabel>
          )}
          <SelectPrimitive.Root
            {...props}
            value={field.value?.toString()}
            onValueChange={(val) => field.onChange(val)}
          >
            {children}
          </SelectPrimitive.Root>
          {fieldState.invalid && fieldState.error && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  )
}

function SelectGroup({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

export { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue };