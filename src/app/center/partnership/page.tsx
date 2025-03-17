"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// 파트너 데이터
const partners = [
  {
    id: 1,
    name: "웰니스 리조트",
    logo: "/images/partners/partner1.png",
    description:
      "최고급 웰니스 리조트와 함께 특별한 휴식 프로그램을 제공합니다.",
    category: "리조트",
  },
  {
    id: 2,
    name: "내추럴 코스메틱",
    logo: "/images/partners/partner2.png",
    description:
      "천연 성분으로 만든 화장품 브랜드와 협력하여 고객님께 최상의 제품을 제공합니다.",
    category: "뷰티",
  },
  {
    id: 3,
    name: "헬스 클럽",
    logo: "/images/partners/partner3.png",
    description:
      "전문 헬스 클럽과 함께 통합적인 건강 관리 서비스를 제공합니다.",
    category: "피트니스",
  },
  {
    id: 4,
    name: "오가닉 푸드",
    logo: "/images/partners/partner4.png",
    description:
      "유기농 식품 브랜드와 협력하여 건강한 식단 프로그램을 제공합니다.",
    category: "식품",
  },
  {
    id: 5,
    name: "메디컬 센터",
    logo: "/images/partners/partner5.png",
    description:
      "전문 의료 기관과 협력하여 과학적이고 안전한 프로그램을 제공합니다.",
    category: "의료",
  },
  {
    id: 6,
    name: "요가 스튜디오",
    logo: "/images/partners/partner6.png",
    description:
      "전문 요가 스튜디오와 함께 마음과 몸의 균형을 찾는 프로그램을 제공합니다.",
    category: "요가",
  },
];

// 파트너십 혜택 데이터
const benefits = [
  {
    title: "브랜드 노출",
    description:
      "바디앤솔의 모든 지점과 온라인 채널을 통해 파트너사의 브랜드를 효과적으로 노출합니다.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-[#8a7e71]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
        />
      </svg>
    ),
  },
  {
    title: "교차 마케팅",
    description:
      "공동 프로모션 및 마케팅 캠페인을 통해 양사의 고객층을 확대합니다.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-[#8a7e71]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    ),
  },
  {
    title: "매출 증대",
    description:
      "상호 보완적인 서비스 제공을 통해 양사의 매출 증대 효과를 기대할 수 있습니다.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-[#8a7e71]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "전문성 강화",
    description:
      "각 분야의 전문성을 결합하여 고객에게 더 나은 가치를 제공합니다.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-[#8a7e71]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
];

export default function PartnershipPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">제휴 파트너십</h1>
        <div className="w-20 h-1 bg-[#b5b67d] mx-auto"></div>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          바디앤솔은 다양한 분야의 파트너사와 함께 고객님께 더 나은 가치를
          제공하기 위해 노력하고 있습니다. 함께 성장하는 파트너십을 통해
          시너지를 창출하고 있습니다.
        </p>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          현재 파트너사
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                  <div className="relative w-10 h-10">
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} 로고`}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {partner.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f5f6e4] text-[#8a7e71]">
                    {partner.category}
                  </span>
                </div>
              </div>
              <p className="text-gray-600">{partner.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg mb-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          파트너십 혜택
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm flex"
            >
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 bg-[#f5f6e4] rounded-full flex items-center justify-center">
                  {benefit.icon}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-[#8a7e71] text-white p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">파트너십 문의</h2>
          <p className="mb-6">
            바디앤솔과 함께 성장할 파트너사를 찾고 있습니다. 아래 버튼을
            클릭하여 파트너십 문의를 남겨주세요.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-[#8a7e71] bg-white hover:bg-gray-100"
          >
            파트너십 문의하기
          </Link>
        </div>
      </div>
    </div>
  );
}
