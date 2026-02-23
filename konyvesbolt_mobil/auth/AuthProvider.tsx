import React, { createContext, useContext, useState, ReactNode } from "react";
import { api, setAccessToken } from "../api/api"; // itt legyen a jwt/axios logika
import { Alert } from 'react-native';

interface AuthContextType {
  user: { email: string, name: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string,name:string } | null>(null);  
  const fetchUserProfile = async (token: string) => {
    try {
      const res = await api.get("/konyvek/profil", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Profile fetch failed", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password }, { withCredentials: true });
      const token = res.data.accessToken;
      setAccessToken(token);
       const userProfile = await fetchUserProfile(token);
       setUser(userProfile); // Beállítjuk a teljes felhasználói profilt
    } catch (error: any) {
      Alert.alert('Hibás belépés');
      // Alert.alert('Hibás belépés', error.message);
      // console.error("Login failed", error);
      //throw error;
    }
  };

  const logout = async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setAccessToken(null);
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
  try {
    await api.post("/auth/register", { name, email, password });
    Alert.alert("Sikeres regisztráció!");
    return true;
  } catch (error: any) {
    Alert.alert("Hiba a regisztráció során", error.response?.data?.message || "Ismeretlen hiba");
    return false;
  }
};
  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
