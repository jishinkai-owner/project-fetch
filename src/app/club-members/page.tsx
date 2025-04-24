import { UserContextProvider } from "@/providers/user";
import HomeComp from "@/components/home";

const UserHomePage = () => {
  return (
    <UserContextProvider>
      <HomeComp />
    </UserContextProvider>
  );
};

export default UserHomePage;
