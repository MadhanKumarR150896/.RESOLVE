import { describe, expect, vi, beforeEach, test } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSupabaseAuth } from "./supabaseAuth";
import { supabase } from "../../supabase/supabaseClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthError } from "@supabase/supabase-js";

vi.mock("../../supabase/supabaseClient");

describe("Supabase Signin and Signout", () => {
  let response: { success: boolean };
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();

    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  test("Checks if signin is successfull", async () => {
    vi.mocked(supabase).auth.signInWithPassword = vi.fn().mockResolvedValue({
      data: {
        session: {
          email: "user1@resolve.com",
          role: "authenticated",
        },
      },
      error: null,
    });

    const { result } = renderHook(() => useSupabaseAuth(), { wrapper });

    await act(async () => {
      response = await result.current.supabaseSignIn(
        "user1@resolve.com",
        "resolve@user"
      );
    });

    expect(response).toEqual({ success: true });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "user1@resolve.com",
      password: "resolve@user",
    });
  });

  test("Shows error for unauthorized profile", async () => {
    vi.mocked(supabase).auth.signInWithPassword = vi.fn().mockResolvedValue({
      data: {
        session: null,
      },
      error: {
        status: 500,
        message: "Error grating user access",
      },
    });

    const { result } = renderHook(() => useSupabaseAuth(), { wrapper });

    await act(async () => {
      response = await result.current.supabaseSignIn(
        "user3@resolve.com",
        "resolve@user"
      );
    });

    expect(response).toEqual({ success: false });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "user3@resolve.com",
      password: "resolve@user",
    });
  });

  test("Checks if Signin fails due to netwokr error", async () => {
    vi.mocked(supabase).auth.signInWithPassword = vi.fn().mockResolvedValue({
      data: {
        session: null,
      },
      error: new Error("Network error"),
    });

    const { result } = renderHook(() => useSupabaseAuth(), { wrapper });

    await act(async () => {
      response = await result.current.supabaseSignIn(
        "user1@resolve.com",
        "resolve@user"
      );
    });

    expect(response).toEqual({ success: false });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "user1@resolve.com",
      password: "resolve@user",
    });
  });

  test("Checks if signout is successfull", async () => {
    vi.mocked(supabase).auth.signOut = vi.fn().mockResolvedValue({
      error: null,
    });
    const clearSpy = vi.spyOn(queryClient, "clear");

    const { result } = renderHook(() => useSupabaseAuth(), { wrapper });

    await act(async () => await result.current.supabaseSignout());

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(clearSpy).toHaveBeenCalled();
  });

  test("Checks if signout is not successfull", async () => {
    vi.mocked(supabase).auth.signOut = vi.fn().mockResolvedValue({
      error: new AuthError("Failed Signout"),
    });
    const clearSpy = vi.spyOn(queryClient, "clear");

    const { result } = renderHook(() => useSupabaseAuth(), { wrapper });

    await act(async () => await result.current.supabaseSignout());

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(clearSpy).not.toHaveBeenCalled();
  });
});
