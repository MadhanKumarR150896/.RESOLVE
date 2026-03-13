import { SigninForm } from "./SigninForm";
import { SigninDetails } from "./SigninDetails";
import LogoLight from "../../assets/Full_logo_L_S.svg";
import { Link } from "react-router";

export const SigninPage = () => (
  <div className="base grid justify-items-center place-content-center gap-8">
    <Link to="/signin">
      <img className="w-28 rounded" src={LogoLight} alt="App_logo" />
    </Link>
    <SigninForm />
    <SigninDetails />
  </div>
);
