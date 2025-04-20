"use client";
import { ReactNode, createContext, useContext, useMemo } from "react";
import { useUser } from "./hook";
import useData from "@/lib/swr/useSWR";
import { UserRes } from "@/types/apiResponse";
import { Suspense } from "react";

export type UserContextType = {
  contextValue: {
    userId?: string | null;
    grade?: number | null;
    Role: {
      isAdmin?: boolean;
      isCL?: boolean;
      isSL?: boolean;
      isMeal?: boolean;
      isEquipment?: boolean;
      isWeather?: boolean;
    } | null;
    isLoading: boolean;
    isError: boolean;
  };
};
type UserContextProviderProps = {
  children: ReactNode;
};
const UserContext = createContext<UserContextType>({
  contextValue: {
    userId: null,
    Role: null,
    isLoading: false,
    isError: false,
  },
});

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  // const { userInfo, isLoading, isError } = useUser();
  const { data, isLoading, isError } = useData<UserRes>("/api/user");

  const contextValue = useMemo(
    () => ({
      userId: data?.data?.id,
      grade: data?.data?.grade,
      Role: !data?.data?.Role
        ? null
        : {
            isAdmin: data?.data?.Role?.isAdmin,
            isCL: data?.data?.Role?.isCL,
            isSL: data?.data?.Role?.isSL,
            isMeal: data?.data?.Role?.isMeal,
            isEquipment: data?.data?.Role?.isEquipment,
            isWeather: data?.data?.Role?.isWeather,
          },
      isLoading,
      isError,
    }),
    [data, isLoading, isError]
    // () => ({
    //   userId: userInfo?.id,
    //   grade: userInfo?.grade || null,
    //   Role: !userInfo?.Role
    //     ? null
    //     : {
    //         isAdmin: userInfo?.Role?.isAdmin,
    //         isCL: userInfo?.Role?.isCL,
    //         isSL: userInfo?.Role?.isSL,
    //         isMeal: userInfo?.Role?.isMeal,
    //         isEquipment: userInfo?.Role?.isEquipment,
    //         isWeather: userInfo?.Role?.isWeather,
    //       },
    //   isLoading,
    //   isError,
    // }),
    // [userInfo, isLoading, isError]
  );

  return (
    <UserContext.Provider
      value={{
        contextValue,
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
