
import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="ml-1 text-destructive">*</span>
        )}
      </Label>

      {children}

      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-base font-semibold tracking-tight">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}
