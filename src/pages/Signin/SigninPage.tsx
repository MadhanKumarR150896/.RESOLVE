import { SigninForm } from "./SigninForm";
import { SigninDetails } from "./SigninDetails";
import LogoLight from "../../assets/Full_logo_L_S.svg";
import { Link } from "react-router";

export const SigninPage = () => (
  <div className="base items-center justify-center py-[20vh]">
    <div className="flex flex-col gap-8 items-center">
      <Link to="/signin">
        <img className="w-28 rounded" src={LogoLight} alt="App_logo" />
      </Link>
      <SigninForm />
      <SigninDetails />
    </div>
  </div>
);
