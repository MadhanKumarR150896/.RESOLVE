import { type ReactNode } from "react";

type ButtonVariant = "btn-black" | "btn-blue";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  children,
  variant = "btn-black",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button className={`${variant} ${className ?? ""}`} {...props}>
      {children}
    </button>
  );
};
