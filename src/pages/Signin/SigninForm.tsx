import { Eye, EyeOff } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { ErrorMessage } from "./ErrorMessage";
import { useSupabaseAuth } from "../../supabase/supabaseAuth";
import { useAuthContext } from "../../context/AuthContext";
import { Button } from "../components/FormElements";

export const SigninForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { supabaseSignIn } = useSupabaseAuth();
  const { showStatus } = useAuthContext();

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!email || !password || !email.endsWith("@resolve.com")) return;
    const result = await supabaseSignIn(email, password);
    if (result.success) {
      setIsSubmitted(false);
      showStatus({ type: "success", message: "Successfully signed in" });
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
            <p className="text-xs text-red-600">Password is required</p>
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
      <Button type="submit" className="w-full mt-4">
        Sign in
      </Button>
    </form>
  );
};
