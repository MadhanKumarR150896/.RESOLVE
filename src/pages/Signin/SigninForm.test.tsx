import { SigninForm } from "./SigninForm";
import { describe, test, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import type { AuthContextType } from "../../context/AuthContext";

describe("Signin Form", () => {
  const user = userEvent.setup();

  const mockValue: Partial<AuthContextType> = {
    showStatus: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Checks if the fields exist", () => {
    render(
      <AuthContext.Provider value={mockValue as AuthContextType}>
        <SigninForm />
      </AuthContext.Provider>,
    );

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  test("To check password visibility", async () => {
    render(
      <AuthContext.Provider value={mockValue as AuthContextType}>
        <SigninForm />
      </AuthContext.Provider>,
    );

    const password = screen.getByLabelText("Password");
    const toggleButton = screen.getByRole("button", { name: /show password/i });

    expect(password).toHaveAttribute("type", "password");
    await user.click(toggleButton);
    expect(password).toHaveAttribute("type", "text");
    expect(toggleButton).toHaveAttribute("aria-label", "Hide password");
  });

  test("Shows error check while submitting with empty fields", async () => {
    render(
      <AuthContext.Provider value={mockValue as AuthContextType}>
        <SigninForm />
      </AuthContext.Provider>,
    );

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText(/password is required/i),
    ).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });
});
