import type { ReactNode } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormRenderProps {
  children: ReactNode;
  className: string;
}
