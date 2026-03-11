import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, act, waitFor } from "@testing-library/react";
import { supabase } from "../supabase/supabaseClient";
import { useAuthContext } from "./AuthContext";
import { AuthProvider } from "./AuthProvider";
import type { AuthChangeEvent } from "@supabase/supabase-js";

vi.mock("../supabase/supabaseClient");

const TestComponent = () => {
  const { profile, authLoading } = useAuthContext();

  return (
    <div>
      <div data-testid="authLoading">{JSON.stringify(authLoading)}</div>
      <div data-testid="profile">{JSON.stringify(profile)}</div>
    </div>
  );
};

describe("Auth Provider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProfile = {
    id: "1",
    email: "user1@resolve.com",
    role: "user",
  };

  test("Renders initial value", () => {
    supabase.auth.onAuthStateChange = vi.fn().mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    });

    supabase.auth.getSession = vi.fn().mockResolvedValue({
      data: { session: null },
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("authLoading")).toHaveTextContent("true");
    expect(screen.getByTestId("profile")).toHaveTextContent("null");
  });

  test("Loads existing session", async () => {
    supabase.auth.onAuthStateChange = vi.fn().mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    });

    supabase.auth.getSession = vi.fn().mockResolvedValue({
      data: {
        session: {
          user: {
            id: "1",
            email: "user1@resolve.com",
          },
        },
      },
    });

    supabase.from = vi.fn().mockReturnValue({
      select: () => ({
        eq: () => ({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          }),
        }),
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalled();
    });
    expect(screen.getByTestId("authLoading")).toHaveTextContent("false");
    expect(screen.getByTestId("profile")).toHaveTextContent(
      "user1@resolve.com",
    );
  });

  test("Loads from authStateChange", async () => {
    let authCallback: (
      event: AuthChangeEvent,
      session: { user: { id: string; email: string } },
    ) => void;

    supabase.auth.getSession = vi.fn().mockResolvedValue({
      data: {
        session: null,
      },
    });

    supabase.auth.onAuthStateChange = vi.fn().mockImplementation((callback) => {
      authCallback = callback;
      return {
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      };
    });

    supabase.from = vi.fn().mockReturnValue({
      select: () => ({
        eq: () => ({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          }),
        }),
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    act(() => {
      authCallback("SIGNED_IN", {
        user: {
          id: "1",
          email: "user1@resolve.com",
        },
      });
    });

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalled();
    });
    expect(screen.getByTestId("profile")).toHaveTextContent(
      "user1@resolve.com",
    );
  });
});
