import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../utils/helper";

interface HeaderProps {
  link: { title: string; path: string };
  isNotFoundPage: boolean;
  showBg: boolean;
}

const HeaderNavItem = ({ link, showBg, isNotFoundPage }: HeaderProps) => {
  const location = useLocation();

  const isSameQueryCategory = () => {
    if (!link.path.includes("?category=")) {
      return false;
    }

    const [path, queryString] = link.path.split("?");
    if (location.pathname !== path) {
      return false;
    }

    const targetCategory = new URLSearchParams(queryString).get("category");
    const currentCategory = new URLSearchParams(location.search).get("category");
    return targetCategory === currentCategory;
  };

  return (
    <li>
      <NavLink
        to={link.path}
        className={({ isActive }) => {
          const computedActive = link.path.includes("?category=")
            ? isSameQueryCategory()
            : isActive;

          return cn(
            "nav-link",
            computedActive
              ? "active text-white"
              : ` ${
                  isNotFoundPage || showBg
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-300 hover:text-white"
                }`
          );
        }}
        end
      >
        {link.title}
      </NavLink>
    </li>
  );
};

export default HeaderNavItem;
