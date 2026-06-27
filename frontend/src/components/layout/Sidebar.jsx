import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Stethoscope,
  Activity,
  ClipboardList,
  FileText,
  Settings,
  Heart,
  Globe,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useLanguage } from "../../context/LanguageContext";

export default function Sidebar() {
  const { t, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const navItems = [
    { name: t.dashboard, href: "/", icon: LayoutDashboard },
    { name: t.aiConsultation, href: "/consultation", icon: Stethoscope },
    { name: t.symptomChecker, href: "/symptoms", icon: Activity },
    { name: t.healthHistory, href: "/history", icon: ClipboardList },
    { name: t.reports, href: "/reports", icon: FileText },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200/80 bg-white/90 backdrop-blur-xl transition-transform">
      <div className="flex h-full flex-col px-4 py-6">
        {/* Branding */}
        <div
          className="flex items-center gap-3 px-2 mb-10 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/35 transition-shadow">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-gray-900 block leading-none">
              {t.appName}
            </span>
            <span className="text-[10px] text-blue-500 font-medium tracking-wide">
              {t.appTagline}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <div className="px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Navigation
          </div>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  end={item.href === "/"}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={cn(
                          "h-5 w-5 transition-colors flex-shrink-0",
                          isActive
                            ? "text-blue-500"
                            : "text-gray-400 group-hover:text-gray-600"
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom */}
        <div className="mt-auto pt-6 border-t border-gray-100 space-y-2">
          {/* Language Toggle */}
          <button
            id="language-toggle-btn"
            onClick={toggleLanguage}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all duration-200"
          >
            <Globe className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <span>{t.languageToggle}</span>
          </button>

          {/* Settings */}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Settings
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600"
                  )}
                />
                {t.settings}
              </>
            )}
          </NavLink>

          {/* User Profile */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 cursor-pointer transition-colors group mt-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              P
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors truncate">
                Patient
              </span>
              <span className="text-xs text-gray-400">Guest Access</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
