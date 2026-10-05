import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SelectOption } from "./types";

export interface OptionSelectProps {
  options: readonly SelectOption[];
  value?: string;
  defaultValue?: string;
  name?: string;
  id?: string;
  className?: string;
  onValueChange?: (value: string) => void;
}

export function OptionSelect({
  options,
  value,
  defaultValue,
  name,
  id,
  className,
  onValueChange,
}: OptionSelectProps) {
  return (
    <Select value={value} defaultValue={defaultValue} name={name} onValueChange={onValueChange}>
      <SelectTrigger id={id} className={cn("w-full", className)}>
        <SelectValue placeholder={options.find((option) => option.value === "")?.label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export interface SelectFieldProps extends OptionSelectProps {
  label: string;
}

export function SelectField({ label, id, ...props }: SelectFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <OptionSelect id={id} {...props} />
    </Field>
  );
}
