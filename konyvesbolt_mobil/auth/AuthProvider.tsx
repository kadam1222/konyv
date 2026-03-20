import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import * as SecureStore from "expo-secure-store"
import { api, setAccessToken } from "../api/api"; // itt legyen a jwt/axios logika
import { Alert, Platform } from 'react-native';

interface AuthContextType {
  user: { email: string, nev: string } | null;
  login: (email: string, jelszo: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (vevo_nev: string, email: string, jelszo: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string,nev:string } | null>(null);  
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() =>{
    const initializeAuth = async () =>{
try {
      let token = null;

      if (Platform.OS !== 'web') {
        // MOBILON: Először megnézzük a tárolót
        token = await SecureStore.getItemAsync('userToken');
      }

      // Ha van token (mobilon) vagy próbálkozunk sütivel (weben)
      const res = await api.post("/auth/refresh", 
        { token: token }, // Mobilon body-ban küldjük a refresh tokent
        { withCredentials: true }
      );

      const newAccessToken = res.data.accessToken;
      setAccessToken(newAccessToken);
      
      const userProfile = await fetchUserProfile(newAccessToken);
      setUser(userProfile);
      
      // Mobilon frissítjük az elmentett access tokent is
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync('userToken', newAccessToken);
      }
    }
      catch (err){
        console.log(err)
      }
      finally {
        setIsLoading(false)
      }
    }
    initializeAuth()
  },[])
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
  
  const login = async (email: string, jelszo: string) => {
    try {
      const res = await api.post("/auth/login", { email, jelszo }, { withCredentials: true });
      const {accessToken, refreshToken} = res.data;
      setAccessToken(accessToken);
       const userProfile = await fetchUserProfile(accessToken);
       setUser(userProfile); 
      if (Platform.OS !== 'web') {
      await SecureStore.setItemAsync('userToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
    }
    } catch (error: any) {
      Alert.alert('Hibás belépés');
      // Alert.alert('Hibás belépés', error.message);
      // console.error("Login failed", error);
      //throw error;
    }
  };

  const logout = async () => {
    try{
      await api.post("/auth/logout", {}, { withCredentials: true });
    }
    finally{
      setAccessToken(null);
      setUser(null);
    }
  };

  const register = async ({ nev, email, jelszo } : {nev: string, email: string, jelszo: string}) => {
  try {
    await api.post("/auth/register", { nev, email, jelszo });
    Alert.alert("Sikeres regisztráció!");
    return true;
  } catch (error: any) {
    Alert.alert("Hiba a regisztráció során", error.response?.data?.message || "Ismeretlen hiba");
    return false;
  }
};
  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);