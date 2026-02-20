import { Link } from "react-router-dom";

import Logo from "../Logo";
import FooterImg from "@/assets/images/footer-bg.webp";
import { footerLinks } from "@/constants";
import { maxWidth } from "@/styles";
import { cn } from "@/utils/helper";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 0%, rgba(0, 217, 255, 0.05), transparent 40%),
          linear-gradient(to bottom, rgba(10,10,10,0.85), rgba(10,10,10,0.95)),
          url(${FooterImg})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="dark:bg-bg-primary bg-gray-900 lg:py-20 sm:py-14 xs:py-10 py-8 w-full border-t border-accent-cyan/20 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-neon opacity-50" />

      <div
        className={cn(
          maxWidth,
          `flex flex-col items-center lg:gap-16 md:gap-14 sm:gap-10 xs:gap-8 gap-6 relative z-10`
        )}
      >
        <Logo logoColor="text-white" />

        <ul className="grid grid-cols-3 items-center justify-center font-medium text-gray-400 capitalize md:gap-x-20 md:gap-y-5 sm:gap-x-12 sm:gap-y-4 xs:gap-x-8 xs:gap-y-3 gap-x-6 gap-y-2">
          {footerLinks.map((title, index) => {
            return (
              <li key={index} className="text-center">
                <Link
                  to="/"
                  className="hover:text-accent-cyan transition-all duration-300 md:text-[13px] sm:text-[12.5px] xs:text-[12px] text-[11px] tracking-[0.1em] uppercase font-bold font-mono group"
                >
                  <span className="relative">
                    {title}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-accent-cyan group-hover:w-full transition-all duration-300" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Copyright */}
        <p className="text-gray-500 text-xs font-mono tracking-wider">
          © 2026 Cinescope. Powered by{" "}
          <span className="font-semibold">TMDB</span>
        </p>
      </div>

      {/* Background glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[100px] pointer-events-none" />
    </footer>
  );
};

export default Footer;
