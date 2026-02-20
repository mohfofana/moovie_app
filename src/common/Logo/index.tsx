import React from "react";
import { Link } from "react-router-dom";

import logo from "@/assets/svg/tmovie.svg";
import { cn } from "@/utils/helper";

interface logoProps {
  className?: string;
  logoColor?: string;
}

const Logo: React.FC<logoProps> = ({
  className = "",
  logoColor = "text-black dark:text-primary",
}) => (
  <Link
    to="/"
    className={cn(
      `flex flex-row items-center xs:gap-2.5 gap-2 group transition-all duration-200`,
      className
    )}
  >
    <img
      src={logo}
      alt="logo"
      className="sm:h-[30px] h-[26px] sm:w-[30px] w-[26px] transition-opacity duration-200 group-hover:opacity-70"
    />
    <span
      className={cn(
        logoColor,
        `font-robotoCondensed tracking-tight sm:text-[26px] text-[22px] leading-none font-bold transition-opacity duration-200 group-hover:opacity-70`
      )}
    >
      Cinescope
    </span>
  </Link>
);

export default Logo;
