
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  const login = (token) => setAccessToken(token);
  const logout = () => setAccessToken(null);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
