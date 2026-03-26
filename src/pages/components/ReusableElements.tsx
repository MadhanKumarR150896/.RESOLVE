import { type ReactNode, forwardRef, useId } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ButtonVariant = "black" | "faker";

type ButtonProps = {
  label?: string;
  children?: ReactNode;
  variant?: ButtonVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variants: Record<ButtonVariant, string> = {
  black:
    "bg-neutral-900 text-neutral-100 rounded py-2 hover:cursor-pointer hover:bg-neutral-800 font-semibold",
  faker:
    "bg-green-800 text-neutral-50 rounded py-2 hover:cursor-pointer hover:bg-green-700 font-semibold",
};

export const Button = ({
  label,
  children,
  variant = "black",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button className={cn(variants[variant], className)} {...props}>
      {label ? label : children}
    </button>
  );
};

type DisplayBoxProps = {
  children?: ReactNode;
  title?: string;
  placeHolderText?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

export const DisplayBox = ({
  children,
  className,
  title,
  placeHolderText,
  ...props
}: DisplayBoxProps) => {
  return (
    <div className="flex flex-col gap-2">
      {title && <span className="font-bold">{title}</span>}
      <div
        className={cn(
          "input h-12 flex items-center px-4",
          !children ? "text-neutral-500" : "bg-neutral-200/50",
        )}
      >
        <span
          className={cn("w-full py-2 overflow-x-clip", className)}
          {...props}
        >
          {children ? children : placeHolderText}
        </span>
      </div>
    </div>
  );
};

type Inputprops = {
  label?: string;
  error?: string | null;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Inputprops>(
  ({ label, error, disabled, className, id, ...props }, ref) => {
    const customId = useId();
    const inputId = id || customId;
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          {label && (
            <label className="font-bold" htmlFor={inputId}>
              {label}
            </label>
          )}
          {error && (
            <p className="error text-sm" role="alert">
              {error}
            </p>
          )}
        </div>
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

type TextAreaProps = {
  label?: string;
  error?: string | null;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const customId = useId();
    const textareaId = id || customId;
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          {label && (
            <label className="font-bold" htmlFor={textareaId}>
              {label}
            </label>
          )}
          {error && (
            <p className="error text-sm" role="alert">
              {error}
            </p>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          className={cn("input h-32 px-4 py-2", className)}
          {...props}
        ></textarea>
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

type SelectGroupProps = {
  label?: string;
  error?: string | null;
  children?: ReactNode;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const SelectGroup = forwardRef<HTMLSelectElement, SelectGroupProps>(
  ({ label, error, children, className, id, ...props }, ref) => {
    const customId = useId();
    const selectId = id || customId;
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          {label && (
            <label className="font-bold" htmlFor={selectId}>
              {label}
            </label>
          )}
          {error && (
            <p className="error text-sm" role="alert">
              {error}
            </p>
          )}
        </div>
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
