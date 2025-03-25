"use client";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type MainContextType = {
  openItem: string;
  drawerOpen: boolean;
  setOpenItem: Dispatch<SetStateAction<string>>;
  setDrawerOpen: Dispatch<SetStateAction<boolean>>;
};

type MainContextProviderProps = {
  children: ReactNode;
};

const MainContext = createContext<MainContextType>({
  openItem: "user-home",
  drawerOpen: true,
  setOpenItem: () => {},
  setDrawerOpen: () => {},
});

export const MainContextProvider = ({ children }: MainContextProviderProps) => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [openItem, setOpenItem] = useState("user-home");

  return (
    <MainContext.Provider
      value={{ openItem, drawerOpen, setOpenItem, setDrawerOpen }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  const context = useContext(MainContext);

  return context;
};
