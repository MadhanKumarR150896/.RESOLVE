import { SigninForm } from "./SigninForm";
import { SigninDetails } from "./SigninDetails";
import LogoLight from "../../assets/Full_logo_L_S.svg";
import { View } from "lucide-react";
import { useState } from "react";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="base items-center justify-center py-[20vh]">
      <div className="flex flex-col gap-8 items-center">
        <div className="flex gap-2 items-center text-xs font-medium px-2 py-1 rounded border shadow shadow-neutral-500 lg:hidden">
          <View size={18} /> <p>Best experienced on wider screen</p>
        </div>
        <div>
          <img className="w-28 rounded" src={LogoLight} alt="App_logo" />
        </div>
        <SigninForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
        <SigninDetails setEmail={setEmail} setPassword={setPassword} />
      </div>
    </div>
  );
};

export default SigninPage;
