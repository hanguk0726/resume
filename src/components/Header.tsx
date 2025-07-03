import { Link, useLocation, useSearchParams } from "react-router-dom";

export default function Header() {
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "ko";
  const toggleLang = lang === "ko" ? "en" : "ko";

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="flex justify-between items-center w-full max-w-[600px] mx-auto pb-4">
      <div className="space-x-4">
        <Link to={`/resume/?lang=${lang}`} className="text-blue-600">
          💻 Develop
        </Link>
        <Link to={`/resume/about?lang=${lang}`} className="text-blue-600">
          👤 About
        </Link>
      </div>
      <Link to={`${currentPath}?lang=${toggleLang}`} className="text-blue-600">
        {toggleLang === "ko" ? "🇰🇷 한국어로 보기" : "🇺🇸 View in English"}
      </Link>
    </nav>
  );
}
