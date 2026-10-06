import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * The signed-in user's id, taken from the JWT rather than the login response.
 *
 * `POST /auth/signin` answers with `{ message, user: { name, email, role }, token }`
 * — there is no `id` on that `user`. The token payload does carry it, so every
 * caller previously had to remember to pass `id: ""`, which left `user.id`
 * undefined and silently disabled `useUserOrders(user.id)` — the orders page then
 * said "No orders yet" right after a successful checkout.
 *
 * Returns "" when the token is malformed or expired rather than throwing: this
 * runs during login and a parse failure must not take the app down.
 */
function userIdFromToken(token: string): string {
  const payload = token.split(".")[1];
  if (!payload) return "";
  try {
    // base64url -> base64, then pad to a multiple of 4 for atob.
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const claims = JSON.parse(atob(padded)) as { id?: unknown; sub?: unknown };
    const id = claims.id ?? claims.sub;
    return typeof id === "string" ? id : "";
  } catch {
    return "";
  }
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  login: (token: string, user: Omit<User, "id"> & { id?: string }) => void;
  logout: () => void;
  setUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,
      login: (token, user) => {
        localStorage.setItem("token", token);
        // Fill in whatever the caller could not know, so the id is never blank.
        set({
          token,
          user: {
            id: user.id || userIdFromToken(token),
            name: user.name ?? "",
            email: user.email ?? "",
            role: user.role ?? "user",
          },
          isLoggedIn: true,
        });
      },
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userToken");
        set({ token: null, user: null, isLoggedIn: false });
      },
      // Merged, not replaced: `PUT /users/updateMe` answers with the fields it
      // changed, so a plain `set({ user })` would drop the id and the name.
      setUser: (user) => set((state) => (state.user ? { user: { ...state.user, ...user } } : {})),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
);