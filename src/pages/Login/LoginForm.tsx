import { Eye, EyeOff } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { ErrorMessage } from "./ErrorMessage";
import { supabaseSignIn } from "../../supabase/supabaseSignIn";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitted(true);
    if (!email || !password || !emailValidation()) return;
    await supabaseSignIn(email, password);
    clearForm();
  }

  function emailValidation() {
    return email.includes("@resolve.com");
  }

  function handlePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  function clearForm() {
    setEmail("");
    setPassword("");
    setIsSubmitted(false);
  }

  const Icon = showPassword ? EyeOff : Eye;

  return (
    <form
      noValidate={
        !email || !password || email.includes("@resolve.com") ? true : false
      }
      onSubmit={handleSubmit}
      className="h-min w-94 border rounded-sm shadow shadow-neutral-500 p-8 flex flex-col gap-4 justify-center items-center"
    >
      <fieldset className="w-full flex flex-col" name="email">
        <label htmlFor="email" className="mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          className="border-neutral-500 text-sm border bg-neutral-200/50 rounded px-2 py-1 outline-0"
          type="email"
          placeholder="usedemoaccount@resolve.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <ErrorMessage email={email} isSubmitted={isSubmitted} />
      </fieldset>
      <fieldset className="w-full flex flex-col" name="password">
        <label htmlFor="password" className="mb-2">
          Password
        </label>
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
          <button type="button" onClick={handlePasswordVisibility}>
            {<Icon strokeWidth="1px" size={20} />}
          </button>
        </div>
        {!password && isSubmitted === true ? (
          <p className="text-xs mt-2 text-red-600">Password is required</p>
        ) : null}
      </fieldset>
      <button
        type="submit"
        className="bg-neutral-900 text-neutral-100 w-full py-2 mt-4 rounded-md hover:cursor-pointer hover:bg-neutral-800"
      >
        Sign in
      </button>
    </form>
  );
};
