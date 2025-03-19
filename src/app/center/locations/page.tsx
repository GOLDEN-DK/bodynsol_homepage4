"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// 지점 정보 데이터
const directStores = [
  {
    id: 1,
    name: "대전 만년 본점",
    description:
      "바디앤솔의 플래그십 스토어로, 최고급 시설과 전문 테라피스트가 함께합니다. VIP 룸과 프라이빗 세션을 제공하며, 도심 속 휴식 공간을 경험하실 수 있습니다.",
    address: "대전 서구 만년로 67번길 22 5층",
    phone: "010-477-2827",
    hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
    images: [
      "/images/locations/manyear1.jpg",
      "/images/locations/manyear2.jpg",
      "/images/locations/manyear3.jpg",
      "/images/locations/manyear4.jpg",
      "/images/locations/manyear5.jpg",
    ],
    mapUrl: "https://map.kakao.com",
    features: ["프리미엄 시설", "전문 테라피스트", "주차 가능", "VIP 룸"],
    sns: {
      homepage: "https://bodynsoul.co.kr/mannyeon",
      blog: "https://blog.naver.com/bodynsoul_mannyeon",
      instagram: "https://instagram.com/bodynsoul_mannyeon",
    },
  },
  {
    id: 2,
    name: "둔산 직영점",
    description:
      "1:1 프라이빗 세션을 제공하며, 도심 속 휴식 공간을 경험하실 수 있습니다.",
    address: "대전광역시 서구 대덕대로 199",
    phone: "02-2345-6789",
    hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
    images: [
      "/images/locations/dunsan1.jpg",
      "/images/locations/dunsan2.jpg",
      "/images/locations/dunsan3.jpg",
      "/images/locations/dunsan4.jpg",
      "/images/locations/dunsan5.jpg",
    ],
    mapUrl: "https://map.kakao.com",
    features: ["트렌디한 인테리어", "커플 프로그램", "주차 가능"],
    sns: {
      homepage: "https://bodynsoul.co.kr/hongdae",
      blog: "https://blog.naver.com/bodynsoul_hongdae",
      instagram: "https://instagram.com/bodynsoul_hongdae",
    },
  },
];

const franchiseStores = [
  {
    id: 3,
    name: "충대점",
    description:
      "대전 최대 200평 규모, 교정,다이어트, 메디필라테스 전문, 메디필라테스 자격증 교육기관, 최고의 강사들만 있는 바디앤솔 충대점!",
    address: "대전광역시 유성구 대학로 84 4층",
    phone: "010-4406-2729",
    hours: "평일 09:00 - 23:00 / 주말 08:00 - 18:00",
    images: [
      "/images/locations/chungdae1.jpg",
      "/images/locations/chungdae2.jpg",
      "/images/locations/chungdae3.jpg",
      "/images/locations/chungdae4.jpg",
      "/images/locations/chungdae5.jpg",
    ],
    mapUrl: "https://map.kakao.com",
    features: ["넓은 주차공간", "다양한 프로그램", "프리미엄 시설"],
    sns: {
      homepage: "https://bodynsol.info",
      blog: " https://blog.naver.com/dreambodynsol_cn",
      instagram: "https://www.instagram.com/bodynsol_cn/",
    },
  },
  {
    id: 4,
    name: "부산 해운대점",
    description:
      "해운대 바닷가와 인접한 위치에서 오션뷰를 감상하며 힐링할 수 있는 프리미엄 가맹점입니다. 특별한 해양 테라피 프로그램을 운영하며 휴양지에서의 특별한 경험을 제공합니다.",
    address: "부산광역시 해운대구 해운대해변로 123 오션타워 8층",
    phone: "051-789-1234",
    hours: "평일 09:00 - 20:00 / 주말 10:00 - 19:00",
    images: [
      "/images/locations/haeundae1.jpg",
      "/images/locations/haeundae2.jpg",
      "/images/locations/haeundae3.jpg",
      "/images/locations/haeundae4.jpg",
      "/images/locations/haeundae5.jpg",
    ],
    mapUrl: "https://map.kakao.com",
    features: ["오션뷰", "해양 테라피", "프리미엄 라운지"],
    sns: {
      homepage: "https://bodynsoul.co.kr/haeundae",
      blog: "https://blog.naver.com/bodynsoul_haeundae",
      instagram: "https://instagram.com/bodynsoul_haeundae",
    },
  },
];

export default function LocationsPage() {
  const [storeType, setStoreType] = useState("direct");
  const [selectedStore, setSelectedStore] = useState(directStores[0]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === selectedStore.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000); // 8초마다 이미지 변경

    return () => clearInterval(timer);
  }, [selectedStore.images.length]);

  const handleStoreTypeChange = (type: "direct" | "franchise") => {
    setStoreType(type);
    if (type === "direct") {
      setSelectedStore(directStores[0]);
    } else {
      setSelectedStore(franchiseStores[0]);
    }
    setCurrentImageIndex(0); // 지점 변경시 이미지 인덱스 초기화
  };

  const currentStores = storeType === "direct" ? directStores : franchiseStores;

  const slideVariants = {
    enter: {
      opacity: 0,
      scale: 1.02,
      transition: {
        duration: 1.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: {
        duration: 1.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === selectedStore.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-black">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#b5b67d] mb-4">지점 안내</h1>
        <div className="w-20 h-1 bg-[#b5b67d] mx-auto"></div>
        <p className="mt-6 text-[#f5f6e4] max-w-3xl mx-auto">
          바디앤솔의 각 지점은 고객님께 최상의 서비스를 제공하기 위해 최적의
          환경을 갖추고 있습니다. 가까운 지점을 방문하셔서 바디앤솔만의 특별한
          경험을 만나보세요.
        </p>
      </div>

      {/* 지점 유형 선택 탭 */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-md shadow-sm bg-[#1a1a1a] p-1">
          <button
            onClick={() => handleStoreTypeChange("direct")}
            className={`px-8 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
              storeType === "direct"
                ? "bg-[#b5b67d] text-black shadow-lg"
                : "text-[#f5f6e4] hover:bg-[#2a2a2a]"
            }`}
          >
            직영점
          </button>
          <button
            onClick={() => handleStoreTypeChange("franchise")}
            className={`px-8 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
              storeType === "franchise"
                ? "bg-[#b5b67d] text-black shadow-lg"
                : "text-[#f5f6e4] hover:bg-[#2a2a2a]"
            }`}
          >
            가맹점
          </button>
        </div>
      </div>

      {/* 지점 선택 버튼 */}
      <div className="mb-10">
        <div className="flex flex-wrap justify-center gap-4">
          {currentStores.map((store) => (
            <button
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedStore.id === store.id
                  ? "bg-[#b5b67d] text-black shadow-md"
                  : "bg-[#1a1a1a] text-[#f5f6e4] hover:bg-[#2a2a2a]"
              }`}
            >
              {store.name}
            </button>
          ))}
        </div>
      </div>

      {/* 선택된 지점 상세 정보 */}
      <motion.div
        key={selectedStore.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1a1a1a] rounded-lg shadow-xl overflow-hidden mb-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-80 lg:h-auto">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentImageIndex}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <Image
                  src={selectedStore.images[currentImageIndex]}
                  alt={`${selectedStore.name} 이미지 ${currentImageIndex + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            {/* 이미지 인디케이터 */}
            <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2">
              {selectedStore.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "bg-[#b5b67d] w-4"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
            {/* 지점 정보 - 이미지 슬라이드쇼와 독립적으로 표시 */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/50 w-full lg:rounded-bl-lg z-10">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-[#b5b67d] text-black mb-2">
                {storeType === "direct" ? "직영점" : "가맹점"}
              </span>
              <h2 className="text-3xl font-bold text-white">
                {selectedStore.name}
              </h2>
            </div>
          </div>

          <div className="p-8">
            <p className="text-[#f5f6e4] mb-6 leading-relaxed">
              {selectedStore.description}
            </p>

            <div className="space-y-5">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#b5b67d]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-[#b5b67d]">주소</h3>
                  <p className="text-[#f5f6e4]">{selectedStore.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#b5b67d]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-[#b5b67d]">연락처</h3>
                  <p className="text-[#f5f6e4]">{selectedStore.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#b5b67d]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-[#b5b67d]">
                    영업시간
                  </h3>
                  <p className="text-[#f5f6e4]">{selectedStore.hours}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[#b5b67d] mb-2">
                  특징
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStore.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#2a2a2a] text-[#f5f6e4] border border-[#3a3a3a]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[#b5b67d] mb-2">SNS</h3>
                <div className="flex space-x-4">
                  <a
                    href={selectedStore.sns.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f5f6e4] hover:text-[#b5b67d] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                      />
                    </svg>
                  </a>
                  <a
                    href={selectedStore.sns.blog}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f5f6e4] hover:text-[#b5b67d] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"
                      />
                    </svg>
                  </a>
                  <a
                    href={selectedStore.sns.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f5f6e4] hover:text-[#b5b67d] transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 19.5h11a3 3 0 003-3v-11a3 3 0 00-3-3h-11a3 3 0 00-3 3z"
                      />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={selectedStore.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-black bg-[#b5b67d] hover:bg-[#a5a66d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b5b67d] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  지도에서 보기
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 지점 방문 안내 */}
      <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-[#b5b67d] mb-8 text-center">
          지점 방문 안내
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            className="bg-[#2a2a2a] p-6 rounded-lg shadow-md border-l-4 border-[#b5b67d]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#3a3a3a] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#b5b67d]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-[#b5b67d] mb-3 text-center">
              사전 예약
            </h3>
            <p className="text-[#f5f6e4] text-center">
              원활한 서비스를 위해 네이버 플레이스를 통해 사전 예약을
              권장합니다.
            </p>
          </motion.div>

          <motion.div
            className="bg-[#2a2a2a] p-6 rounded-lg shadow-md border-l-4 border-[#b5b67d]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#3a3a3a] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#b5b67d]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3v-11a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-[#b5b67d] mb-3 text-center">
              결제 방법
            </h3>
            <p className="text-[#f5f6e4] text-center">
              현금, 신용카드, 모바일 페이 등 다양한 결제 방법을 지원합니다.
            </p>
          </motion.div>

          <motion.div
            className="bg-[#2a2a2a] p-6 rounded-lg shadow-md border-l-4 border-[#b5b67d]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#3a3a3a] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#b5b67d]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-[#b5b67d] mb-3 text-center">
              복장 안내
            </h3>
            <p className="text-[#f5f6e4] text-center">
              레슨시에는 운동복과 토삭스를 준비하고 방문해 주세요. 세면도구는
              개인 지참을 권장합니다.
            </p>
          </motion.div>

          <motion.div
            className="bg-[#2a2a2a] p-6 rounded-lg shadow-md border-l-4 border-[#b5b67d]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#3a3a3a] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#b5b67d]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-[#b5b67d] mb-3 text-center">
              상담 문의
            </h3>
            <p className="text-[#f5f6e4] text-center">
              프로그램 및 서비스에 관한 상담은 각 지점으로 문의해 주시기
              바랍니다.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
