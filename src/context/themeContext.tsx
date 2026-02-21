import React, { useContext, useState, useEffect, useCallback } from "react";
import { saveTheme, getTheme } from "@/utils/helper";

const context = React.createContext({
  setShowThemeOptions: (prev: boolean) => {},
  showThemeOptions: false,
  openMenu: () => {},
  closeMenu: () => {},

  setTheme: (newTheme: string) => {},
  checkSystemTheme: () => {},
  theme: "",
});

interface Props {
  children: React.ReactNode;
}

const initialTheme = getTheme();

const ThemeProvider = ({ children }: Props) => {
  const [showThemeOptions, setShowThemeOptions] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>(initialTheme === "Dark" ? "Dark" : "Dark");

  const checkSystemTheme = () => {
    setTheme("Dark");
  };

  const checkTheme = useCallback(() => {
    setTheme("Dark");
  }, []);

  useEffect(() => {
    checkTheme();
  }, [checkTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    root.classList.remove("light");
    root.style.colorScheme = "dark";
    saveTheme("Dark");
  }, [theme]);

  const openMenu = () => {
    setShowThemeOptions(true);
  };

  const closeMenu = useCallback(() => {
    setShowThemeOptions(false);
  }, []);

  return (
    <context.Provider
      value={{
        showThemeOptions,
        openMenu,
        closeMenu,
        setTheme,
        theme,
        checkSystemTheme,
        setShowThemeOptions,
      }}
    >
      {children}
    </context.Provider>
  );
};

export default ThemeProvider;

export const useTheme = () => {
  return useContext(context);
};
