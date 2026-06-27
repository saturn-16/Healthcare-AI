import { Bell, Search, Globe } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function Topbar() {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200/80 bg-white/80 px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900 leading-none">
            {t.appName}
          </h1>
          <p className="text-[10px] text-blue-500 font-medium">{t.appTagline}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" />
          <input
            id="topbar-search"
            type="text"
            placeholder={language === "hi" ? "लक्षण, रिपोर्ट खोजें..." : "Search symptoms, reports..."}
            className="h-9 w-56 rounded-full bg-gray-50 border border-gray-200 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/40 transition-all"
          />
        </div>

        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
        >
          <Globe className="h-3.5 w-3.5" />
          {language === "en" ? "हिंदी" : "English"}
        </button>

        {/* Notifications */}
        <button className="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        </button>
      </div>
    </header>
  );
}
