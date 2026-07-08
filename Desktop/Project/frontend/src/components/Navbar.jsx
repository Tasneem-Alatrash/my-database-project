import { NavLink } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export default function Navbar() {
  const { t, lang, toggleLang } = useLanguage();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? "bg-primary-600 text-white" : "text-gray-700 hover:bg-primary-50 hover:text-primary-700"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-2 font-extrabold text-xl text-primary-700">
          <img src="/leaf.svg" alt="" className="w-7 h-7" />
          {t("appName")}
        </NavLink>

        <div className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            {t("nav.home")}
          </NavLink>
          <NavLink to="/classify" className={linkClass}>
            {t("nav.classify")}
          </NavLink>
          <NavLink to="/marketplace" className={linkClass}>
            {t("nav.marketplace")}
          </NavLink>
          <NavLink to="/dashboard" className={linkClass}>
            {t("nav.dashboard")}
          </NavLink>

          <button
            onClick={toggleLang}
            className="ms-2 px-3 py-2 rounded-lg text-sm font-medium border border-primary-200 text-primary-700 hover:bg-primary-50 transition-colors"
          >
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </div>
      </div>
    </nav>
  );
}
