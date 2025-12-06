import { UserContextProvider } from "@/providers/user";
import HomeComp from "@/components/home";
import React from "react";

const UserHomePage = () => {
  return (
    <UserContextProvider>
      <HomeComp />
    </UserContextProvider>
  );
};

export default UserHomePage;
