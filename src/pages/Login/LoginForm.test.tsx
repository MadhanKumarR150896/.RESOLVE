import { LoginForm } from "./LoginForm";
import { describe, test, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { AuthContext } from "../../context/AuthContext";
import type { AuthContextType } from "../../context/AuthContext";

describe("Login Form", () => {
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
        <LoginForm />
      </AuthContext.Provider>,
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  test("To check password visibility", async () => {
    render(
      <AuthContext.Provider value={mockValue as AuthContextType}>
        <LoginForm />
      </AuthContext.Provider>,
    );

    const password = screen.getByLabelText("Password");
    const toggleButton = screen.getAllByRole("button")[0];

    expect(password).toHaveAttribute("type", "password");
    await user.click(toggleButton);
    expect(password).toHaveAttribute("type", "text");
  });

  test("Shows error check while submitting with empty fields", async () => {
    render(
      <AuthContext.Provider value={mockValue as AuthContextType}>
        <LoginForm />
      </AuthContext.Provider>,
    );

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });
});
