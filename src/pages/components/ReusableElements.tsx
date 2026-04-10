import { type ReactNode, forwardRef, useId } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Search } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ButtonVariant = "black" | "faker";

export type ButtonProps = {
  label?: string;
  variant?: ButtonVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variants: Record<ButtonVariant, string> = {
  black:
    "bg-neutral-900 text-neutral-100 rounded py-2 hover:cursor-pointer hover:bg-neutral-800 font-semibold",
  faker:
    "bg-green-800 text-neutral-50 rounded py-2 hover:cursor-pointer hover:bg-green-700 font-semibold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ label, children, variant = "black", className, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(variants[variant], className)} {...props}>
        {label ? label : children}
      </button>
    );
  },
);

export type SpanProps = {
  label?: string;
  labelClass?: string;
  placeHolderText?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export const Span = ({
  children,
  className,
  label,
  labelClass,
  placeHolderText,
  ...props
}: SpanProps) => {
  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {label && <span className={cn("font-bold", labelClass)}>{label}</span>}
      <div
        className={cn(
          "input h-12 flex items-center px-4",
          className,
          !children ? "text-neutral-500" : "bg-neutral-200/50",
        )}
      >
        <span className="w-full py-1 overflow-x-clip" {...props}>
          {children ? children : placeHolderText}
        </span>
      </div>
    </div>
  );
};

export type DivProps = {
  label?: string;
  labelClass?: string;
  placeHolderText?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const Div = ({
  children,
  className,
  label,
  labelClass,
  placeHolderText,
  ...props
}: DivProps) => {
  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {label && <span className={cn("font-bold", labelClass)}>{label}</span>}
      <div className={cn("input h-32 px-4 pbs-2 pbe-3", className)}>
        <div
          className="h-full overflow-y-auto overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
          {...props}
        >
          {children ? children : placeHolderText}
        </div>
      </div>
    </div>
  );
};

export type Inputprops = {
  label?: string;
  labelClass?: string;
  error?: string | null;
  errorClass?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Inputprops>(
  (
    { label, labelClass, error, errorClass, disabled, className, id, ...props },
    ref,
  ) => {
    const customId = useId();
    const inputId = id || customId;
    return (
      <div className="flex flex-col gap-2 w-full h-full">
        {(label || error) && (
          <div className="flex items-baseline justify-between">
            {label && (
              <label className={cn("font-bold", labelClass)} htmlFor={inputId}>
                {label}
              </label>
            )}
            {error && (
              <p className={cn("error text-sm", errorClass)} role="alert">
                {error}
              </p>
            )}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          className={cn(
            "input h-12 px-4",
            disabled ? "bg-neutral-200/50" : "",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export type SearchBoxProps = {
  className?: string;
  iconSize?: number;
  iconStrokeWidth?: number;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
};

export const SearchBox = ({
  className,
  inputProps,
  iconSize = 18,
  iconStrokeWidth = 1,
  buttonProps,
}: SearchBoxProps) => {
  return (
    <div
      className={cn(
        "flex justify-between border rounded py-1 px-2 gap-2 border-neutral-500",
        className,
      )}
    >
      <input
        {...inputProps}
        className={cn("outline-none", inputProps?.className)}
      />
      <button type="button" {...buttonProps}>
        <Search strokeWidth={iconStrokeWidth} size={iconSize} />
      </button>
    </div>
  );
};

export type TextAreaProps = {
  label?: string;
  labelClass?: string;
  error?: string | null;
  errorClass?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, labelClass, error, errorClass, className, id, ...props }, ref) => {
    const customId = useId();
    const textareaId = id || customId;
    return (
      <div className="flex flex-col gap-2 w-full h-full">
        {(label || error) && (
          <div className="flex items-baseline justify-between">
            {label && (
              <label
                className={cn("font-bold", labelClass)}
                htmlFor={textareaId}
              >
                {label}
              </label>
            )}
            {error && (
              <p className={cn("error text-sm", errorClass)} role="alert">
                {error}
              </p>
            )}
          </div>
        )}
        <div className={cn("input h-32 px-4 pbs-2 pbe-3", className)}>
          <textarea
            className="h-full w-full outline-none resize-none"
            style={{ scrollbarWidth: "none" }}
            id={textareaId}
            ref={ref}
            {...props}
          ></textarea>
        </div>
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export type SelectGroupProps = {
  label?: string;
  labelClass?: string;
  error?: string | null;
  errorClass?: string;
  children?: ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const SelectGroup = forwardRef<HTMLSelectElement, SelectGroupProps>(
  (
    { label, labelClass, error, errorClass, children, className, id, ...props },
    ref,
  ) => {
    const customId = useId();
    const selectId = id || customId;
    return (
      <div className="flex flex-col gap-2 w-full h-full">
        {(label || error) && (
          <div className="flex items-baseline justify-between">
            {label && (
              <label className={cn("font-bold", labelClass)} htmlFor={selectId}>
                {label}
              </label>
            )}
            {error && (
              <p className={cn("error text-sm", errorClass)} role="alert">
                {error}
              </p>
            )}
          </div>
        )}

        <select
          ref={ref}
          id={selectId}
          className={cn("input h-12", className)}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  },
);

SelectGroup.displayName = "SelectGroup";
