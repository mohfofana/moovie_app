import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { BsMoonStarsFill } from "react-icons/bs";
import { AiOutlineMenu } from "react-icons/ai";
import { FiSun } from "react-icons/fi";
import throttle from "lodash.throttle";

import { ThemeMenu, Logo } from "..";
import HeaderNavItem from "./HeaderNavItem";

import { useGlobalContext } from "@/context/globalContext";
import { useTheme } from "@/context/themeContext";
import { maxWidth, textColor } from "@/styles";
import { navLinks } from "@/constants";
import { THROTTLE_DELAY } from "@/utils/config";
import { cn } from "@/utils/helper";

const Header = () => {
  const { openMenu, theme, showThemeOptions } = useTheme();
  const { setShowSidebar } = useGlobalContext();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isNotFoundPage, setIsNotFoundPage] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const handleBackgroundChange = () => {
      const body = document.body;
      if (
        window.scrollY > 0 ||
        (body.classList.contains("no-scroll") &&
          parseFloat(body.style.top) * -1 > 0)
      ) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    const throttledHandleBackgroundChange = throttle(
      handleBackgroundChange,
      THROTTLE_DELAY
    );

    window.addEventListener("scroll", throttledHandleBackgroundChange);

    return () => {
      window.removeEventListener("scroll", throttledHandleBackgroundChange);
    };
  }, []);

  useEffect(() => {
    if (location.pathname.split("/").length > 3) {
      setIsNotFoundPage(true);
    } else {
      setIsNotFoundPage(false);
    }
  }, [location.pathname]);

  return (
    <header
      className={cn(
        `md:py-5 py-4 fixed top-0 left-0 w-full z-50 transition-all duration-300`,
        isActive && (theme === "Dark" ? "header-bg--dark" : "header-bg--light")
      )}
    >
      <nav
        className={cn(maxWidth, `flex justify-between flex-row items-center`)}
      >
        <Logo
          logoColor={cn(
            isNotFoundPage
              ? "text-black dark:text-white"
              : !isNotFoundPage && isActive
              ? "text-black dark:text-white"
              : "text-white"
          )}
        />

        <div className="hidden md:flex flex-row gap-12 items-center text-gray-700 dark:text-gray-400">
          <ul className="flex flex-row gap-8 text-[14px] font-medium">
            {navLinks.map((link: { title: string; path: string }) => {
              return (
                <HeaderNavItem
                  key={link.title}
                  link={link}
                  isNotFoundPage={isNotFoundPage}
                  showBg={isActive}
                />
              );
            })}
          </ul>

          <div className="button relative">
            <button
              name="theme-menu"
              type="button"
              onClick={openMenu}
              id="theme"
              className={cn(
                `flex items-center justify-center rounded-full p-2 transition-all duration-200 hover:bg-white/10`,
                isNotFoundPage || isActive
                  ? `text-gray-700 dark:text-white`
                  : `text-white/90`
              )}
            >
              {theme === "Dark" ? <BsMoonStarsFill size={15} /> : <FiSun size={15} />}
            </button>
            <AnimatePresence>
              {showThemeOptions && <ThemeMenu />}
            </AnimatePresence>
          </div>
        </div>

        <button
          type="button"
          name="menu"
          className={cn(
            `inline-block text-[22px] md:hidden transition-all duration-200 p-2 rounded-lg hover:bg-white/10`,
            isNotFoundPage || isActive
              ? `text-gray-700 dark:text-white`
              : `text-white/90`
          )}
          onClick={() => setShowSidebar(true)}
        >
          <AiOutlineMenu />
        </button>
      </nav>
    </header>
  );
};

export default Header;
