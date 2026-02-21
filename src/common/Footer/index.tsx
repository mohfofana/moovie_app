import { Link } from "react-router-dom";

import Logo from "../Logo";
import { footerLinks } from "@/constants";
import { maxWidth } from "@/styles";
import { cn } from "@/utils/helper";

const footerLabelFr: Record<string, string> = {
  home: "accueil",
  live: "direct",
  "you must watch": "a voir absolument",
  "contact us": "contact",
  FAQ: "faq",
  "Recent release": "sorties recentes",
  "term of services": "conditions d utilisation",
  premium: "premium",
  "Top IMDB": "top imdb",
  "About us": "a propos",
  "Privacy policy": "politique de confidentialite",
};

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background:
          "radial-gradient(1100px 420px at 82% -6%, rgba(186, 40, 40, 0.24), transparent 62%), radial-gradient(850px 340px at 0% 100%, rgba(120, 16, 16, 0.22), transparent 58%), linear-gradient(180deg, #120707 0%, #070303 100%)",
      }}
      className="w-full lg:pt-20 lg:pb-10 sm:pt-16 sm:pb-9 xs:pt-12 xs:pb-8 pt-10 pb-7 border-t border-white/10 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(255,255,255,0.04),transparent_36%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-400/45 to-transparent" />

      <div className={cn(maxWidth, "relative z-10")}>
        <div className="grid lg:grid-cols-[minmax(0,1fr)_auto] gap-10 items-start">
          <div className="space-y-5 max-w-[540px]">
            <Logo logoColor="text-white" />
            <p className="text-[15px] leading-relaxed text-white/70">
              Plateforme cinema inspiree des codes streaming premium:
              decouverte, watchlist et navigation fluide dans un univers sombre
              et immersif.
            </p>
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
              <span className="text-[13px] text-white/75">
                Lance une nouvelle session de visionnage
              </span>
              <Link
                to="/movie"
                className="rounded-xl bg-red-500/90 hover:bg-red-500 text-white font-semibold text-[13px] px-4 py-2 transition-colors duration-200"
              >
                Explorer
              </Link>
            </div>
            <div className="rounded-2xl border border-red-300/20 bg-red-950/30 px-4 py-3 text-[12px] leading-relaxed text-white/70">
              <span className="font-semibold text-white/85">Disclaimer:</span>{" "}
              Ce site n heberge aucun contenu video. Les donnees, images et
              metadonnees proviennent de fournisseurs tiers, notamment TMDB.
            </div>
          </div>

          <ul className="grid sm:grid-cols-3 grid-cols-2 sm:gap-x-10 gap-x-6 gap-y-3 pt-1">
            {footerLinks.map((title, index) => (
              <li key={index}>
                <Link
                  to="/"
                  className="text-white/60 hover:text-white text-[12px] tracking-[0.12em] uppercase font-semibold transition-colors duration-200"
                >
                  {footerLabelFr[title] ?? title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/12 to-transparent mt-10 mb-4" />

        <div className="flex sm:flex-row flex-col sm:items-center sm:justify-between gap-3 text-[12px] text-white/45 tracking-[0.08em] uppercase">
          <p>&copy; 2026 Cinescope. Tous droits reserves.</p>
          <p className="text-[15px] tracking-[0.03em] normal-case text-white/75">
            De babi a Rennes avec <span className="text-red-500">&hearts;</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
