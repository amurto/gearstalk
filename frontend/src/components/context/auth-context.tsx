import { createContext } from "react";

interface Auth {
  isLoggedIn: boolean;
  userId: string | boolean | null;
  token: string | boolean | null;
  login: (uid: any, token: any, expirationDate: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<Auth>({
  isLoggedIn: false,
  userId: null,
  token: null,
  login: () => {},
  logout: () => {},
});
