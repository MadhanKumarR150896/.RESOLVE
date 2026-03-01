import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  function handlePassword() {
    setShowPassword((prev) => !prev);
  }

  const Icon = showPassword ? EyeOff : Eye;

  return (
    <form className="h-min w-94 border rounded-sm shadow shadow-neutral-500 p-8 flex flex-col gap-4 justify-center items-center">
      <fieldset className="w-full flex flex-col" name="email">
        <label className="mb-2">Email</label>
        <input
          className="border-neutral-500 text-sm border bg-neutral-200/50 rounded px-2 py-1 outline-0"
          type="email"
          placeholder="usedemoaccount@resolve.com"
          required
        />
      </fieldset>
      <fieldset className="w-full flex flex-col" name="password">
        <label className="mb-2">Password</label>
        <div className="flex border rounded px-2 py-1 text-sm border-neutral-500 bg-neutral-200/50">
          <input
            className="flex-1 outline-0"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
          />
          <button type="button" onClick={handlePassword}>
            {<Icon strokeWidth="1px" size={20} />}
          </button>
        </div>
      </fieldset>
      <button
        type="submit"
        className="bg-neutral-900 text-neutral-100 w-full py-2 mt-4 rounded-md hover:cursor-pointer hover:bg-neutral-800"
      >
        Login
      </button>
    </form>
  );
};
