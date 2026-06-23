import { SigninForm } from "./SigninForm";
import { SigninDetails } from "./SigninDetails";
import LogoLight from "../../assets/Full_logo_L_S.svg";
import { Link } from "react-router";
import { View } from "lucide-react";

const SigninPage = () => (
  <div className="base items-center justify-center py-[20vh]">
    <div className="flex flex-col gap-8 items-center">
      <div className="flex gap-2 items-center text-xs font-medium px-2 py-1 rounded border shadow shadow-neutral-500">
        <View size={18} /> Best experienced on desktop view
      </div>
      <Link to="/signin">
        <img className="w-28 rounded" src={LogoLight} alt="App_logo" />
      </Link>
      <SigninForm />
      <SigninDetails />
    </div>
  </div>
);

export default SigninPage;
