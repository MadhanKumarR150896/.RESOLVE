import { SigninForm } from "./SigninForm";
import { describe, test, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { cleanup, render, screen } from "@testing-library/react";
import { useSupabaseAuth } from "./supabaseAuth";

vi.mock("./supabaseAuth");

describe("Signin Form", () => {
  let user: ReturnType<typeof userEvent.setup>;
  const mockSignin = vi.fn();
  const mockSignout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();

    vi.mocked(useSupabaseAuth).mockReturnValue({
      supabaseSignIn: mockSignin,
      supabaseSignout: mockSignout,
    });

    render(<SigninForm />);
  });

  test("Checks if the fields exist", () => {
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test("To check password visibility", async () => {
    const password = screen.getByLabelText("Password");
    const toggleButton = screen.getByRole("button", { name: /show password/i });

    expect(password).toHaveAttribute("type", "password");
    await user.click(toggleButton);
    expect(password).toHaveAttribute("type", "text");
    expect(toggleButton).toHaveAttribute("aria-label", "Hide password");
  });

  test("Shows error check while submitting with empty fields", async () => {
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();

    expect(mockSignin).not.toHaveBeenCalled();
  });

  test("To check if signin is called when entering valid data", async () => {
    mockSignin.mockResolvedValue({
      success: true,
    });
    cleanup();
    render(<SigninForm />);

    await user.type(screen.getByLabelText(/email/i), "user1@resolve.com");
    await user.type(screen.getByLabelText(/Password/), "resolve@user");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockSignin).toHaveBeenCalled();
  });

  test("To check if signin is not called when entering invalid data", async () => {
    await user.type(screen.getByLabelText(/email/i), "user1@gmail.com");
    await user.type(screen.getByLabelText(/Password/), "resolve@user");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockSignin).not.toHaveBeenCalled();
  });
});
