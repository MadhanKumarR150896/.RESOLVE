type ErrorMessageProps = {
  email: string;
  isSubmitted: boolean;
};

export const ErrorMessage = ({ email, isSubmitted }: ErrorMessageProps) => {
  return (
    <>
      {email && isSubmitted && !email.endsWith("@resolve.com") && (
        <p className="text-xs text-red-600">
          Valid email ends with '@resolve.com'
        </p>
      )}
      {!email && isSubmitted && (
        <p className="text-xs text-red-600">Email is required</p>
      )}
    </>
  );
};
