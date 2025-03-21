import { renderHook, waitFor } from "@testing-library/react-native";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter, useSegments } from "expo-router";
import { useUserStore } from "@/storage";
import { usersMe } from "@/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock dependencies
jest.mock("@clerk/clerk-expo");
jest.mock("expo-router");
jest.mock("@/client");
jest.mock("@/storage", () => ({
  useUserStore: jest.fn(),
}));

describe("useAuthRedirect", () => {
  // Setup mocks
  const mockRouter = {
    replace: jest.fn(),
  };
  const mockGetToken = jest.fn();
  const mockSetUser = jest.fn();
  const mockUsersMeResponse = {
    data: { id: "123", email: "test@example.com" },
  };

  // Create a fresh QueryClient for each test
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mock implementations
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSegments as jest.Mock).mockReturnValue(["(authenticated)"]);
    (useUserStore as unknown as jest.Mock).mockReturnValue({ setUser: mockSetUser });
    (usersMe as jest.Mock).mockResolvedValue(mockUsersMeResponse);
  });

  it("should redirect to login when accessing authenticated route while not signed in", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: false,
      getToken: mockGetToken,
    });

    renderHook(() => useAuthRedirect(), {
      wrapper: createWrapper(),
    });

    expect(mockRouter.replace).toHaveBeenCalledWith("/");
  });

  it("should fetch user data and redirect to lock screen when signed in", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      getToken: mockGetToken.mockResolvedValue("mock-token"),
    });
    (useSegments as jest.Mock).mockReturnValue([""]);

    renderHook(() => useAuthRedirect(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(mockUsersMeResponse.data);
      expect(mockRouter.replace).toHaveBeenCalledWith("/(authenticated)/modals/lock");
    });
  });

  it("should handle missing auth token", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      getToken: mockGetToken.mockResolvedValue(null),
    });
    (useSegments as jest.Mock).mockReturnValue([""]);

    renderHook(() => useAuthRedirect(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockSetUser).not.toHaveBeenCalled();
      expect(mockRouter.replace).not.toHaveBeenCalledWith("/(authenticated)/modals/lock");
    });
  });

  it("should not fetch user data when auth is not loaded", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: false,
      isSignedIn: true,
      getToken: mockGetToken,
    });

    renderHook(() => useAuthRedirect(), {
      wrapper: createWrapper(),
    });

    expect(mockGetToken).not.toHaveBeenCalled();
    expect(mockSetUser).not.toHaveBeenCalled();
  });

  it("should handle API errors gracefully", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      getToken: mockGetToken.mockResolvedValue("mock-token"),
    });
    (useSegments as jest.Mock).mockReturnValue([""]);
    (usersMe as jest.Mock).mockRejectedValue(new Error("API Error"));

    renderHook(() => useAuthRedirect(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mockSetUser).not.toHaveBeenCalled();
    });
  });

  it("should return correct loading and auth states", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
      getToken: mockGetToken,
    });

    const { result } = renderHook(() => useAuthRedirect(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toEqual({
      isLoaded: true,
      isSignedIn: true,
      isLoading: false,
    });
  });
}); 