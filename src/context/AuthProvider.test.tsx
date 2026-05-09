import { describe, test, expect, vi, beforeEach } from "vitest";
import { act, waitFor, renderHook } from "@testing-library/react";
import { supabase } from "../supabase/supabaseClient";
import { AuthProvider } from "./AuthProvider";
import type { AuthChangeEvent } from "@supabase/supabase-js";
import {
  QueryClient,
  QueryClientProvider,
  queryOptions,
} from "@tanstack/react-query";
import { useAuthContext } from "./AuthContext";
import { getProfile } from "./getProfile";
import type { ProfileType } from "../supabase/requiredTypes";

vi.mock("../supabase/supabaseClient");
vi.mock("./getProfile");

type Callback = (
  event: AuthChangeEvent,
  session: { user: { id: string; email: string } } | null
) => void;

describe("Auth Provider", () => {
  let queryClient: QueryClient;

  const mockProfile = {
    id: "1",
    email: "user1@resolve.com",
    name: "User 1",
    role: "user",
  };

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

    vi.mocked(supabase).auth.onAuthStateChange = vi.fn().mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    });

    vi.mocked(supabase).auth.getSession = vi.fn().mockResolvedValue({
      data: {
        session: null,
      },
    });

    vi.mocked(getProfile).mockImplementation((profileId) => {
      return queryOptions({
        queryKey: ["profile", profileId],
        queryFn: async () => {
          return mockProfile as ProfileType;
        },
      });
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  };

  test("Renders initial value", () => {
    vi.mocked(supabase).auth.getSession = vi
      .fn()
      .mockResolvedValue(new Promise(() => {}));

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    expect(result.current.authLoading).toBe(true);
    expect(result.current.session).toBe(null);
  });

  test("Loads existing session", async () => {
    vi.mocked(supabase).auth.getSession = vi.fn().mockResolvedValue({
      data: {
        session: {
          user: {
            id: "1",
            email: "user1@resolve.com",
          },
        },
      },
    });

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.authLoading).toBe(false);
    });

    expect(getProfile).toHaveBeenCalledWith("1");
    expect(result.current.profile).toEqual(mockProfile);
  });

  test("Signin through authStateChange", async () => {
    let authCallback: Callback;

    vi.mocked(supabase).auth.onAuthStateChange = vi
      .fn()
      .mockImplementation((callback) => {
        authCallback = callback;
        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        };
      });

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.authLoading).toBe(false);
    });

    act(() => {
      authCallback("SIGNED_IN", {
        user: {
          id: "1",
          email: "user1@resolve.com",
        },
      });
    });

    await waitFor(() => {
      expect(getProfile).toHaveBeenCalledWith("1");
      expect(result.current.profile).toEqual(mockProfile);
    });
  });

  test("Signout through authStateChange", async () => {
    let authCallback: Callback;

    vi.mocked(supabase).auth.onAuthStateChange = vi
      .fn()
      .mockImplementation((callback) => {
        authCallback = callback;
        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        };
      });

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    await waitFor(() => {
      expect(result.current.authLoading).toBe(false);
    });

    act(() => {
      authCallback("SIGNED_OUT", null);
    });

    await waitFor(() => {
      expect(result.current.session).toEqual(null);
      expect(result.current.profile).toEqual(null);
    });
  });
});
