"use client";
import { ReactNode, createContext, useContext, useMemo } from "react";
import useData from "@/lib/swr/useSWR";
import { UserRes } from "@/types/apiResponse";
import { RolesState } from "@/types/user";
import React from "react";

export type UserContextType = {
  contextValue: {
    userId: string | null;
    // roles: { name: string }[];
    grade: number | null;
    roles: RolesState;
    // roles: {
    //   isSL: boolean;
    //   isCL: boolean;
    //   isMeal: boolean;
    //   isWeather: boolean;
    //   isEquipment: boolean;
    // };
    isLoading: boolean;
    isError: boolean;
  };
};
type UserContextProviderProps = {
  children: ReactNode;
};
// const UserContext = createContext<UserContextType>({
//   contextValue: {
//     userId: null,
//     // Role: null,
//     roles: [],
//     isLoading: false,
//     isError: false,
//   },
// });

const UserContext = createContext<UserContextType>({
  contextValue: {
    userId: null,
    // roles: [],
    grade: null,
    roles: {
      isAdmin: false,
      isSL: false,
      isCL: false,
      isMeal: false,
      isWeather: false,
      isEquipment: false,
    },
    isLoading: false,
    isError: false,
  },
});

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const { data: res, isLoading, isError } = useData<UserRes>("/api/user");

  const data = res?.data;

  // const contextValue = useMemo(
  //   () => {}
  //   // () => ({
  //   //   userId: data.roles,
  //   //   grade: data.grade,
  //   //   roles; data.roles,
  //   //
  //   //   // userId: data?.data?.id,
  //   //   // grade: data?.data?.grade,
  //   //   // Role: !data?.data?.Role
  //   //   //   ? null
  //   //   //   : {
  //   //   //       isAdmin: data?.data?.Role?.isAdmin,
  //   //   //       isCL: data?.data?.Role?.isCL,
  //   //   //       isSL: data?.data?.Role?.isSL,
  //   //   //       isMeal: data?.data?.Role?.isMeal,
  //   //   //       isEquipment: data?.data?.Role?.isEquipment,
  //   //   //       isWeather: data?.data?.Role?.isWeather,
  //   //   //     },
  //   //   isLoading,
  //   //   isError,
  //   }),
  //   [data, isLoading, isError],
  // );
  // const contextValue = useMemo(
  //   () => {
  //   const roles = data?.roles || [];
  //   const hasRole = (roleName: string) => {
  //     return roles.some((role) => role.name === roleName);
  //   }
  //
  //   }
  //   // () => ({
  //   //   userId: data?.id,
  //   //   grade: data?.grade,
  //   //   roles: data?.roles || [],
  //   //   isLoading,
  //   //   isError,
  //   // }),
  //   // [data, isLoading, isError],
  // );
  const contextValue = useMemo(() => {
    const roles = data?.roles || [];
    // Helper to check role existence safely
    const hasRole = (name: string) => roles.some((r) => r.name === name);

    return {
      userId: data?.id || null,
      // roles: roles,
      grade: data?.grade || null,
      roles: {
        isAdmin: hasRole("Admin"),
        isSL: hasRole("SL"),
        isCL: hasRole("CL"),
        isMeal: hasRole("Meal"),
        isWeather: hasRole("Weather"),
        isEquipment: hasRole("Equipment"),
      },
      isLoading,
      isError,
    };
  }, [data, isLoading, isError]);

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
