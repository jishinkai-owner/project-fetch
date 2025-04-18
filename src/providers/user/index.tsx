"use client";
import { ReactNode, createContext, useContext } from "react";
import { useUser } from "./hook";

type UserContextType = {
  userId?: string | null;
  isAdmin?: boolean;
  isCL?: boolean;
  isSL?: boolean;
  isMeal?: boolean;
  isEquipment?: boolean;
  isWeather?: boolean;
  isLoading?: boolean;
  isError?: boolean;
};
type UserContextProviderProps = {
  children: ReactNode;
};
const UserContext = createContext<UserContextType>({
  userId: null,
  isAdmin: false,
  isCL: false,
  isSL: false,
  isMeal: false,
  isEquipment: false,
  isWeather: false,
  isLoading: true,
  isError: false,
});

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const { userInfo, isLoading, isError } = useUser();

  const userId = userInfo?.id;
  const isAdmin = userInfo?.isAdmin;
  const isCL = userInfo?.isCL;
  const isSL = userInfo?.isSL;
  const isMeal = userInfo?.isMeal;
  const isEquipment = userInfo?.isEquipment;
  const isWeather = userInfo?.isWeather;

  return (
    <UserContext.Provider
      value={{
        userId,
        isAdmin,
        isCL,
        isSL,
        isMeal,
        isEquipment,
        isWeather,
        isLoading,
        isError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};
