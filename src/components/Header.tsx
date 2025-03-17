"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

// 센터 하위메뉴 정의
const centerSubmenus = [
  { name: "브랜드소개", path: "/center/brand" },
  { name: "대표 인사말", path: "/center/message" },
  { name: "지점 안내", path: "/center/locations" },
  { name: "제휴 파트너십", path: "/center/partnership" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCenterSubmenuOpen, setIsCenterSubmenuOpen] = useState(false);
  const [isMobileCenterSubmenuOpen, setIsMobileCenterSubmenuOpen] =
    useState(false);
  const pathname = usePathname();
  const submenuRef = useRef<HTMLDivElement>(null);

  // 센터 메뉴 또는 하위메뉴 중 하나가 활성화되어 있는지 확인
  const isCenterActive =
    pathname === "/center" ||
    centerSubmenus.some((item) => pathname === item.path);

  // 클릭 이벤트 핸들러
  const handleClickOutside = (event: MouseEvent) => {
    if (
      submenuRef.current &&
      !submenuRef.current.contains(event.target as Node)
    ) {
      setIsCenterSubmenuOpen(false);
    }
  };

  // 이벤트 리스너 등록 및 해제
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (path: string) => {
    return pathname === path
      ? "text-[#b5b67d] font-bold"
      : "text-gray-700 hover:text-[#b5b67d]";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/logo.png"
                alt="바디앤솔 로고"
                width={60}
                height={60}
                className="mr-3"
              />
              <span className="text-xl font-bold text-[#8a7e71]">바디앤솔</span>
            </Link>
          </div>

          {/* 데스크탑 메뉴 */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8 md:items-center">
            <Link
              href="/"
              className={`inline-flex items-center px-1 pt-1 pb-1 border-b-2 ${
                pathname === "/" ? "border-[#b5b67d]" : "border-transparent"
              } ${isActive("/")}`}
            >
              홈
            </Link>

            {/* 센터 메뉴 (하위메뉴 포함) */}
            <div className="relative h-16 flex items-center" ref={submenuRef}>
              <button
                className={`inline-flex items-center px-1 pt-1 pb-1 border-b-2 ${
                  isCenterActive ? "border-[#b5b67d]" : "border-transparent"
                } ${
                  isCenterActive
                    ? "text-[#b5b67d] font-bold"
                    : "text-gray-700 hover:text-[#b5b67d]"
                }`}
                onClick={() => setIsCenterSubmenuOpen(!isCenterSubmenuOpen)}
              >
                센터
                <svg
                  className={`ml-1 h-4 w-4 transition-transform ${
                    isCenterSubmenuOpen ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* 센터 하위메뉴 */}
              {isCenterSubmenuOpen && (
                <div className="absolute left-0 top-16 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {centerSubmenus.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`block px-4 py-2 text-sm ${
                          pathname === item.path
                            ? "bg-gray-100 text-[#b5b67d] font-medium"
                            : "text-gray-700 hover:bg-gray-50 hover:text-[#b5b67d]"
                        }`}
                        onClick={() => setIsCenterSubmenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/academy"
              className={`inline-flex items-center px-1 pt-1 pb-1 border-b-2 ${
                pathname === "/academy"
                  ? "border-[#b5b67d]"
                  : "border-transparent"
              } ${isActive("/academy")}`}
            >
              아카데미
            </Link>
            <Link
              href="/courses"
              className={`inline-flex items-center px-1 pt-1 pb-1 border-b-2 ${
                pathname === "/courses"
                  ? "border-[#b5b67d]"
                  : "border-transparent"
              } ${isActive("/courses")}`}
            >
              교육과정
            </Link>
            <Link
              href="/community"
              className={`inline-flex items-center px-1 pt-1 pb-1 border-b-2 ${
                pathname === "/community"
                  ? "border-[#b5b67d]"
                  : "border-transparent"
              } ${isActive("/community")}`}
            >
              커뮤니티
            </Link>
            <Link
              href="/contact"
              className={`inline-flex items-center px-1 pt-1 pb-1 border-b-2 ${
                pathname === "/contact"
                  ? "border-[#b5b67d]"
                  : "border-transparent"
              } ${isActive("/contact")}`}
            >
              상담/문의
            </Link>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">메뉴 열기</span>
              {/* 햄버거 아이콘 */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* X 아이콘 */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className={`block pl-3 pr-4 py-2 border-l-4 ${
              pathname === "/"
                ? "border-[#b5b67d] bg-[#f5f6e4] text-[#8a7e71]"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-[#8a7e71]"
            }`}
          >
            홈
          </Link>

          {/* 모바일 센터 메뉴 */}
          <div>
            <button
              onClick={() =>
                setIsMobileCenterSubmenuOpen(!isMobileCenterSubmenuOpen)
              }
              className={`w-full flex justify-between items-center pl-3 pr-4 py-2 border-l-4 ${
                isCenterActive
                  ? "border-[#b5b67d] bg-[#f5f6e4] text-[#8a7e71]"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-[#8a7e71]"
              }`}
            >
              <span>센터</span>
              <svg
                className={`h-5 w-5 transition-transform ${
                  isMobileCenterSubmenuOpen ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {/* 모바일 센터 하위메뉴 */}
            {isMobileCenterSubmenuOpen && (
              <div className="pl-6">
                {centerSubmenus.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`block pl-3 pr-4 py-2 border-l-4 ${
                      pathname === item.path
                        ? "border-[#b5b67d] bg-[#f5f6e4] text-[#8a7e71]"
                        : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-[#8a7e71]"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/academy"
            className={`block pl-3 pr-4 py-2 border-l-4 ${
              pathname === "/academy"
                ? "border-[#b5b67d] bg-[#f5f6e4] text-[#8a7e71]"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-[#8a7e71]"
            }`}
          >
            아카데미
          </Link>
          <Link
            href="/courses"
            className={`block pl-3 pr-4 py-2 border-l-4 ${
              pathname === "/courses"
                ? "border-[#b5b67d] bg-[#f5f6e4] text-[#8a7e71]"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-[#8a7e71]"
            }`}
          >
            교육과정
          </Link>
          <Link
            href="/community"
            className={`block pl-3 pr-4 py-2 border-l-4 ${
              pathname === "/community"
                ? "border-[#b5b67d] bg-[#f5f6e4] text-[#8a7e71]"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-[#8a7e71]"
            }`}
          >
            커뮤니티
          </Link>
          <Link
            href="/contact"
            className={`block pl-3 pr-4 py-2 border-l-4 ${
              pathname === "/contact"
                ? "border-[#b5b67d] bg-[#f5f6e4] text-[#8a7e71]"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-[#8a7e71]"
            }`}
          >
            상담/문의
          </Link>
        </div>
      </div>
    </header>
  );
}
