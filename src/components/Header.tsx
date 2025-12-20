import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Code2, User, Globe } from "lucide-react";

export default function Header() {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "ko";
  const toggleLang = lang === "ko" ? "en" : "ko";

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="flex justify-between items-center w-full max-w-[600px] mx-auto pb-4">
      <div className="flex items-center space-x-4">
        <Link to={`/resume/?lang=${lang}`} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors">
          <Code2 size={18} strokeWidth={1.5} />
          <span>{lang === "ko" ? "프로젝트" : "Projects"}</span>
        </Link>
        <Link to={`/resume/about?lang=${lang}`} className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors">
          <User size={18} strokeWidth={1.5} />
          <span>{lang === "ko" ? "소개" : "About"}</span>
        </Link>
      </div>
      <Link to={`${currentPath}?lang=${toggleLang}`} className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors text-sm">
        <Globe size={16} strokeWidth={1.5} />
        {toggleLang === "ko" ? "한국어" : "EN"}
      </Link>
    </nav>
  );
}
