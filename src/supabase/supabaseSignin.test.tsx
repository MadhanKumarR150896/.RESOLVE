import { describe, expect, vi, beforeEach, test } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSupabaseAuth } from "./supabaseSignIn";
import { supabase } from "./supabaseClient";
import { AuthContext } from "../context/AuthContext";
import type { AuthContextType } from "../context/AuthContext";

vi.mock("./supabaseClient");

describe("Supabase Signin", () => {
  let response: { success: boolean };

  const mockValue: Partial<AuthContextType> = {
    setAuthStatus: vi.fn(),
    showStatus: vi.fn(),
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <AuthContext.Provider value={mockValue as AuthContextType}>
        {children}
      </AuthContext.Provider>
    );
  };

  const { result } = renderHook(() => useSupabaseAuth(), { wrapper });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Checks if signin is successfull", async () => {
    supabase.auth.signInWithPassword = vi.fn().mockResolvedValue({
      data: {
        session: {
          email: "user1@resolve.com",
          role: "authenticated",
        },
      },
      error: null,
    });

    await act(async () => {
      response = await result.current.supabaseSignIn(
        "user1@resolve.com",
        "resolve@user",
      );
    });

    expect(mockValue.setAuthStatus).toHaveBeenCalledWith({
      type: "loading",
      message: "Signing in ...",
    });

    expect(response).toMatchObject({ success: true });
  });

  test("Shows error for unauthenticated profile", async () => {
    supabase.auth.signInWithPassword = vi.fn().mockResolvedValue({
      data: {
        session: null,
      },
      error: "AuthError",
    });

    await act(async () => {
      response = await result.current.supabaseSignIn(
        "user3@resolve.com",
        "resolve@user",
      );
    });

    expect(mockValue.showStatus).toHaveBeenCalledWith({
      type: "error",
      message: "Invalid login credentials",
    });

    expect(response).toEqual({ success: false });
  });
});
