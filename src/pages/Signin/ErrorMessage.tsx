type ErrorMessageProps = {
  email: string;
  isSubmitted: boolean;
};

export const ErrorMessage = ({ email, isSubmitted }: ErrorMessageProps) => {
  if (!isSubmitted) return null;

  const message = !email
    ? "Email is required"
    : email && !email.endsWith("@resolve.com")
      ? "Valid email ends with @resolve.com"
      : null;

  return <>{message && <p className="error">{message}</p>}</>;
};
