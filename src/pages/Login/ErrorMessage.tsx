type ErrorMessageProps = {
  email: string;
  isSubmitted: boolean;
};

export const ErrorMessage = ({ email, isSubmitted }: ErrorMessageProps) => {
  return (
    <>
      {email && isSubmitted && !email.includes("@resolve.com") ? (
        <p className="text-xs mt-2 text-red-600">
          Enter a valid email with domain '@resolve.com'
        </p>
      ) : null}
      {!email && isSubmitted ? (
        <p className="text-xs mt-2 text-red-600">Email is required</p>
      ) : null}
    </>
  );
};
