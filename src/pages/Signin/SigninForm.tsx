import { Eye, EyeOff } from "lucide-react";
import React, { useState, type SyntheticEvent } from "react";
import { ErrorMessage } from "./ErrorMessage";
import { useSupabaseAuth } from "../../services/authService";
import { Button } from "../../utils/Reusables";
import { useToasterStore } from "../../stores/toasterStore";

type SigninFormProps = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
};

export const SigninForm = ({
  email,
  setEmail,
  password,
  setPassword,
}: SigninFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateToaster, removeToaster, clearToasters } = useToasterStore(
    (state) => state
  );
  const { supabaseSignIn } = useSupabaseAuth();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!email || !password || !email.endsWith("@resolve.com")) return;
    setIsLoading(true);
    const loadingId = crypto.randomUUID();
    clearToasters(loadingId);
    updateToaster({
      type: "loading",
      id: loadingId,
      message: "Signing in...",
    });
    try {
      const result = await supabaseSignIn(email, password);
      removeToaster(loadingId);
      if (result.success) {
        const successId = crypto.randomUUID();
        clearToasters(successId);
        updateToaster({
          type: "success",
          id: successId,
          message: "Successfully signed in",
        });
        setIsSubmitted(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  function handlePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  const Icon = showPassword ? EyeOff : Eye;

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="h-min w-94 border rounded shadow shadow-neutral-500 p-8 flex flex-col gap-6 justify-center items-center"
    >
      <fieldset className="w-full flex flex-col" name="email">
        <div className="flex mb-2 items-baseline justify-between">
          <label htmlFor="email">Email</label>
          <ErrorMessage email={email} isSubmitted={isSubmitted} />
        </div>
        <input
          id="email"
          name="email"
          className="input text-sm bg-neutral-200/50"
          type="email"
          placeholder="usedemoaccount@resolve.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </fieldset>
      <fieldset className="w-full flex flex-col" name="password">
        <div className="flex mb-2 items-baseline justify-between">
          <label htmlFor="password">Password</label>
          {!password && isSubmitted && (
            <p className="error">Password is required</p>
          )}
        </div>
        <div className="flex border rounded px-2 py-1 text-sm border-neutral-500 bg-neutral-200/50">
          <input
            id="password"
            name="password"
            className="flex-1 outline-0"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={handlePasswordVisibility}
          >
            <Icon strokeWidth={1} size={20} />
          </button>
        </div>
      </fieldset>
      <Button type="submit" className="w-full mt-4" disabled={isLoading}>
        Sign in
      </Button>
    </form>
  );
};
