import { LoginForm } from "./LoginForm";
import { LoginDetails } from "./LoginDetails";
import LogoLight from "../../assets/Full_logo_L_S.svg";
import { Link } from "react-router";

export function LoginPage() {
  return (
    <div className="base grid justify-items-center place-content-center gap-8">
      <Link to="/">
        <img className="w-28 rounded" src={LogoLight} alt="App_logo" />
      </Link>
      <LoginForm />
      <LoginDetails />
    </div>
  );
}
