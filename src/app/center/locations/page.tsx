"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Store {
  id: number;
  name: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  images: string[];
  mapUrl: string;
  features: string[];
  sns: {
    homepage: string;
    blog: string;
    instagram: string;
  };
}

interface StoreData {
  [key: string]: Store[];
}

// 지점 정보 데이터
const academyStores: StoreData = {
  대전: [
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
  ],
  세종: [
    {
      id: 2,
      name: "세종 보람점",
      description:
        "세종시의 대표 아카데미 지점입니다. 넓은 공간과 최신 시설을 갖추고 있으며, 전문 테라피스트들이 함께합니다.",
      address: "세종시 보람동 1234-5",
      phone: "044-123-4567",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/boram.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능", "샤워실"],
      sns: {
        homepage: "https://bodynsoul.co.kr/boram",
        blog: "https://blog.naver.com/bodynsoul_boram",
        instagram: "https://instagram.com/bodynsoul_boram",
      },
    },
  ],
  청주: [
    {
      id: 3,
      name: "청주 동남점",
      description:
        "청주시의 대표 아카데미 지점입니다. 최신 필라테스 기구와 전문 강사진이 함께합니다.",
      address: "청주시 동남동 567-8",
      phone: "043-123-4567",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/dongnam.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능", "샤워실"],
      sns: {
        homepage: "https://bodynsoul.co.kr/dongnam",
        blog: "https://blog.naver.com/bodynsoul_dongnam",
        instagram: "https://instagram.com/bodynsoul_dongnam",
      },
    },
  ],
};

const directStores: StoreData = {
  대전: [
    {
      id: 4,
      name: "대전 만년점",
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
      id: 5,
      name: "대전 갈마점",
      description:
        "갈마동에 위치한 직영점입니다. 편리한 접근성과 쾌적한 환경을 제공합니다.",
      address: "대전 서구 갈마동 123-4",
      phone: "042-123-4567",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/galma.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능"],
      sns: {
        homepage: "https://bodynsoul.co.kr/galma",
        blog: "https://blog.naver.com/bodynsoul_galma",
        instagram: "https://instagram.com/bodynsoul_galma",
      },
    },
    {
      id: 6,
      name: "대전 둔산점",
      description:
        "둔산동에 위치한 직영점입니다. 현대적인 시설과 전문적인 서비스를 제공합니다.",
      address: "대전 서구 둔산동 234-5",
      phone: "042-234-5678",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/dunsan.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능", "샤워실"],
      sns: {
        homepage: "https://bodynsoul.co.kr/dunsan",
        blog: "https://blog.naver.com/bodynsoul_dunsan",
        instagram: "https://instagram.com/bodynsoul_dunsan",
      },
    },
    {
      id: 7,
      name: "대전 유천점",
      description:
        "유천동에 위치한 직영점입니다. 쾌적한 환경과 전문적인 서비스를 제공합니다.",
      address: "대전 서구 유천동 345-6",
      phone: "042-345-6789",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/yucheon.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능"],
      sns: {
        homepage: "https://bodynsoul.co.kr/yucheon",
        blog: "https://blog.naver.com/bodynsoul_yucheon",
        instagram: "https://instagram.com/bodynsoul_yucheon",
      },
    },
    {
      id: 8,
      name: "대전 문화점",
      description:
        "문화동에 위치한 직영점입니다. 편리한 접근성과 쾌적한 환경을 제공합니다.",
      address: "대전 서구 문화동 456-7",
      phone: "042-456-7890",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/munhwa.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능"],
      sns: {
        homepage: "https://bodynsoul.co.kr/munhwa",
        blog: "https://blog.naver.com/bodynsoul_munhwa",
        instagram: "https://instagram.com/bodynsoul_munhwa",
      },
    },
    {
      id: 9,
      name: "대전 가수원점",
      description:
        "가수원동에 위치한 직영점입니다. 현대적인 시설과 전문적인 서비스를 제공합니다.",
      address: "대전 서구 가수원동 567-8",
      phone: "042-567-8901",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/gasuwon.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능", "샤워실"],
      sns: {
        homepage: "https://bodynsoul.co.kr/gasuwon",
        blog: "https://blog.naver.com/bodynsoul_gasuwon",
        instagram: "https://instagram.com/bodynsoul_gasuwon",
      },
    },
  ],
  세종: [
    {
      id: 10,
      name: "세종 반곡점",
      description:
        "반곡동에 위치한 직영점입니다. 넓은 공간과 최신 시설을 갖추고 있습니다.",
      address: "세종시 반곡동 678-9",
      phone: "044-234-5678",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/bangok.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능"],
      sns: {
        homepage: "https://bodynsoul.co.kr/bangok",
        blog: "https://blog.naver.com/bodynsoul_bangok",
        instagram: "https://instagram.com/bodynsoul_bangok",
      },
    },
    {
      id: 11,
      name: "세종 대평점",
      description:
        "대평동에 위치한 직영점입니다. 현대적인 시설과 전문적인 서비스를 제공합니다.",
      address: "세종시 대평동 789-0",
      phone: "044-345-6789",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/daepyeong.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능", "샤워실"],
      sns: {
        homepage: "https://bodynsoul.co.kr/daepyeong",
        blog: "https://blog.naver.com/bodynsoul_daepyeong",
        instagram: "https://instagram.com/bodynsoul_daepyeong",
      },
    },
    {
      id: 12,
      name: "세종 소담점",
      description:
        "소담동에 위치한 직영점입니다. 쾌적한 환경과 전문적인 서비스를 제공합니다.",
      address: "세종시 소담동 890-1",
      phone: "044-456-7890",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/sodam.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능"],
      sns: {
        homepage: "https://bodynsoul.co.kr/sodam",
        blog: "https://blog.naver.com/bodynsoul_sodam",
        instagram: "https://instagram.com/bodynsoul_sodam",
      },
    },
    {
      id: 13,
      name: "세종 나성점",
      description:
        "나성동에 위치한 직영점입니다. 편리한 접근성과 쾌적한 환경을 제공합니다.",
      address: "세종시 나성동 901-2",
      phone: "044-567-8901",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/naseong.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능"],
      sns: {
        homepage: "https://bodynsoul.co.kr/naseong",
        blog: "https://blog.naver.com/bodynsoul_naseong",
        instagram: "https://instagram.com/bodynsoul_naseong",
      },
    },
    {
      id: 14,
      name: "세종 고운점",
      description:
        "고운동에 위치한 직영점입니다. 현대적인 시설과 전문적인 서비스를 제공합니다.",
      address: "세종시 고운동 012-3",
      phone: "044-678-9012",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/goun.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능", "샤워실"],
      sns: {
        homepage: "https://bodynsoul.co.kr/goun",
        blog: "https://blog.naver.com/bodynsoul_goun",
        instagram: "https://instagram.com/bodynsoul_goun",
      },
    },
  ],
  청주: [
    {
      id: 15,
      name: "청주 송절점",
      description:
        "송절동에 위치한 직영점입니다. 편리한 접근성과 쾌적한 환경을 제공합니다.",
      address: "청주시 송절동 234-5",
      phone: "043-345-6789",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/songjeol.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능"],
      sns: {
        homepage: "https://bodynsoul.co.kr/songjeol",
        blog: "https://blog.naver.com/bodynsoul_songjeol",
        instagram: "https://instagram.com/bodynsoul_songjeol",
      },
    },
  ],
};

const franchiseStores: StoreData = {
  대전: [
    {
      id: 16,
      name: "대전 충대점",
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
        blog: "https://blog.naver.com/dreambodynsol_cn",
        instagram: "https://www.instagram.com/bodynsol_cn/",
      },
    },
    {
      id: 17,
      name: "대전 관평점",
      description:
        "관평동에 위치한 가맹점입니다. 현대적인 시설과 전문적인 서비스를 제공합니다.",
      address: "대전 서구 관평동 345-6",
      phone: "042-456-7890",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/gwanpyeong.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능"],
      sns: {
        homepage: "https://bodynsoul.co.kr/gwanpyeong",
        blog: "https://blog.naver.com/bodynsoul_gwanpyeong",
        instagram: "https://instagram.com/bodynsoul_gwanpyeong",
      },
    },
    {
      id: 18,
      name: "대전 관저점",
      description:
        "관저동에 위치한 가맹점입니다. 편리한 접근성과 쾌적한 환경을 제공합니다.",
      address: "대전 서구 관저동 456-7",
      phone: "042-567-8901",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/gwanjeo.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능"],
      sns: {
        homepage: "https://bodynsoul.co.kr/gwanjeo",
        blog: "https://blog.naver.com/bodynsoul_gwanjeo",
        instagram: "https://instagram.com/bodynsoul_gwanjeo",
      },
    },
  ],
  세종: [
    {
      id: 19,
      name: "세종 보람점",
      description:
        "보람동에 위치한 가맹점입니다. 넓은 공간과 최신 시설을 갖추고 있습니다.",
      address: "세종시 보람동 567-8",
      phone: "044-678-9012",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: [
        "/images/locations/boram1.jpeg",
        "/images/locations/boram2.jpeg",
        "/images/locations/boram3.jpeg",
        "/images/locations/boram4.jpeg",
        "/images/locations/boram5.jpeg",
        "/images/locations/boram6.jpeg",
        "/images/locations/boram7.jpeg",
      ],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능"],
      sns: {
        homepage: "https://bodynsoul.co.kr/boram",
        blog: "https://blog.naver.com/bodynsoul_boram",
        instagram: "https://instagram.com/bodynsoul_boram",
      },
    },
  ],
  청주: [
    {
      id: 20,
      name: "청주 율량점",
      description:
        "율량동에 위치한 가맹점입니다. 현대적인 시설과 전문적인 서비스를 제공합니다.",
      address: "청주시 율량동 678-9",
      phone: "043-456-7890",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/yullyang.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능"],
      sns: {
        homepage: "https://bodynsoul.co.kr/yullyang",
        blog: "https://blog.naver.com/bodynsoul_yullyang",
        instagram: "https://instagram.com/bodynsoul_yullyang",
      },
    },
    {
      id: 21,
      name: "청주 가경점",
      description:
        "가경동에 위치한 가맹점입니다. 편리한 접근성과 쾌적한 환경을 제공합니다.",
      address: "청주시 가경동 789-0",
      phone: "043-567-8901",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/gagyeong.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능"],
      sns: {
        homepage: "https://bodynsoul.co.kr/gagyeong",
        blog: "https://blog.naver.com/bodynsoul_gagyeong",
        instagram: "https://instagram.com/bodynsoul_gagyeong",
      },
    },
  ],
  계룡: [
    {
      id: 22,
      name: "계룡 계룡점",
      description:
        "계룡시에 위치한 가맹점입니다. 현대적인 시설과 전문적인 서비스를 제공합니다.",
      address: "계룡시 계룡동 890-1",
      phone: "042-678-9012",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/gyeryong.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능"],
      sns: {
        homepage: "https://bodynsoul.co.kr/gyeryong",
        blog: "https://blog.naver.com/bodynsoul_gyeryong",
        instagram: "https://instagram.com/bodynsoul_gyeryong",
      },
    },
  ],
  공주: [
    {
      id: 23,
      name: "공주 신관점",
      description:
        "공주시 신관동에 위치한 가맹점입니다. 편리한 접근성과 쾌적한 환경을 제공합니다.",
      address: "공주시 신관동 901-2",
      phone: "041-789-0123",
      hours: "평일 10:00 - 21:00 / 주말 10:00 - 18:00",
      images: ["/images/locations/singwan.jpg"],
      mapUrl: "https://map.kakao.com",
      features: ["프리미엄 시설", "전문 테라피스트", "주차 가능"],
      sns: {
        homepage: "https://bodynsoul.co.kr/singwan",
        blog: "https://blog.naver.com/bodynsoul_singwan",
        instagram: "https://instagram.com/bodynsoul_singwan",
      },
    },
  ],
};

export default function LocationsPage() {
  const [storeType, setStoreType] = useState<
    "academy" | "direct" | "franchise"
  >("academy");
  const [selectedRegion, setSelectedRegion] = useState<string>("대전");
  const [selectedStore, setSelectedStore] = useState<Store>(
    academyStores.대전[0]
  );
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const storeDetailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === selectedStore.images.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);

    return () => clearInterval(timer);
  }, [selectedStore.images.length]);

  const handleStoreTypeChange = (type: "academy" | "direct" | "franchise") => {
    setStoreType(type);
    setSelectedRegion("대전");
    if (type === "academy") {
      setSelectedStore(academyStores.대전[0]);
    } else if (type === "direct") {
      setSelectedStore(directStores.대전[0]);
    } else {
      setSelectedStore(franchiseStores.대전[0]);
    }
    setCurrentImageIndex(0);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    if (storeType === "academy") {
      setSelectedStore(academyStores[region][0]);
    } else if (storeType === "direct") {
      setSelectedStore(directStores[region][0]);
    } else {
      setSelectedStore(franchiseStores[region][0]);
    }
    setCurrentImageIndex(0);
  };

  const getCurrentStores = () => {
    if (storeType === "academy") {
      return academyStores[selectedRegion];
    } else if (storeType === "direct") {
      return directStores[selectedRegion];
    } else {
      return franchiseStores[selectedRegion];
    }
  };

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setCurrentImageIndex(0);
    // 상세보기의 상단이 화면에 걸리도록 스크롤 위치 조정
    const offset = 100; // 상단 여백
    const elementPosition =
      storeDetailRef.current?.getBoundingClientRect().top ?? 0;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-black">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#b5b67d] mb-4">지점 안내</h1>
        <div className="w-20 h-1 bg-[#b5b67d] mx-auto"></div>
        <p className="mt-6 text-[#f5f6e4] max-w-3xl mx-auto">
          바디앤솔의 각 지점은 고객님께 최상의 서비스를 제공하기 위해 최적의
          환경을 갖추고 있습니다.
        </p>
      </div>

      {/* 지점 유형 선택 */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg mb-8 transition-all duration-300 hover:bg-[#2a2a2a] hover:shadow-xl">
        <h2 className="text-lg font-semibold text-[#b5b67d] mb-4 text-center">
          지점 유형
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleStoreTypeChange("academy")}
            className={`px-8 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              storeType === "academy"
                ? "bg-[#b5b67d] text-black shadow-lg"
                : "bg-[#2a2a2a] text-[#b5b67d] hover:bg-[#3a3a3a] hover:text-white"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            아카데미
          </button>
          <button
            onClick={() => handleStoreTypeChange("direct")}
            className={`px-8 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              storeType === "direct"
                ? "bg-[#b5b67d] text-black shadow-lg"
                : "bg-[#2a2a2a] text-[#b5b67d] hover:bg-[#3a3a3a] hover:text-white"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            직영점
          </button>
          <button
            onClick={() => handleStoreTypeChange("franchise")}
            className={`px-8 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
              storeType === "franchise"
                ? "bg-[#b5b67d] text-black shadow-lg"
                : "bg-[#2a2a2a] text-[#b5b67d] hover:bg-[#3a3a3a] hover:text-white"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            가맹점
          </button>
        </div>
      </div>

      {/* 지역 선택 */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-lg mb-8 transition-all duration-300 hover:bg-[#2a2a2a] hover:shadow-xl">
        <h2 className="text-lg font-semibold text-[#b5b67d] mb-4 text-center">
          지역 선택
        </h2>
        <div className="flex justify-center gap-4 flex-wrap">
          {storeType === "franchise"
            ? // 가맹점일 때는 모든 지역 표시
              ["대전", "세종", "청주", "계룡", "공주"].map((region) => (
                <button
                  key={region}
                  onClick={() => handleRegionChange(region)}
                  className={`px-8 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedRegion === region
                      ? "bg-[#b5b67d] text-black shadow-lg"
                      : "bg-[#2a2a2a] text-[#b5b67d] hover:bg-[#3a3a3a] hover:text-white"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                  {region}
                </button>
              ))
            : // 아카데미와 직영점일 때는 대전, 세종, 청주만 표시
              ["대전", "세종", "청주"].map((region) => (
                <button
                  key={region}
                  onClick={() => handleRegionChange(region)}
                  className={`px-8 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    selectedRegion === region
                      ? "bg-[#b5b67d] text-black shadow-lg"
                      : "bg-[#2a2a2a] text-[#b5b67d] hover:bg-[#3a3a3a] hover:text-white"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                  {region}
                </button>
              ))}
        </div>
      </div>

      {/* 지점 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {getCurrentStores().map((store: Store) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-[#1a1a1a] rounded-lg shadow-xl overflow-hidden cursor-pointer transition-all duration-300 ${
              selectedStore.id === store.id
                ? "ring-2 ring-[#b5b67d]"
                : "hover:ring-2 hover:ring-[#b5b67d]/50"
            }`}
            onClick={() => handleStoreSelect(store)}
          >
            <div className="relative h-48">
              <Image
                src={store.images[0]}
                alt={store.name}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-t-lg"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white mb-2">
                {store.name}
              </h3>
              <p className="text-[#b5b67d] text-sm mb-2">{store.address}</p>
              <div className="flex flex-wrap gap-2">
                {store.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-[#2a2a2a] text-[#b5b67d]"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 선택된 지점 상세 정보 */}
      <motion.div
        ref={storeDetailRef}
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
                {storeType === "academy"
                  ? "아카데미"
                  : storeType === "direct"
                  ? "직영점"
                  : "가맹점"}
              </span>
              <h2 className="text-3xl font-bold text-white">
                {selectedStore.name}
              </h2>
            </div>
          </div>

          <div className="p-8">
            <p className="text-[#f5f6e4] mb-6">{selectedStore.description}</p>
            <div className="space-y-4">
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-[#b5b67d] mr-3 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
                <div>
                  <h3 className="text-lg font-semibold text-[#b5b67d] mb-1">
                    주소
                  </h3>
                  <p className="text-[#f5f6e4]">{selectedStore.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-[#b5b67d] mr-3 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-[#b5b67d] mb-1">
                    연락처
                  </h3>
                  <p className="text-[#f5f6e4]">{selectedStore.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-[#b5b67d] mr-3 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-[#b5b67d] mb-1">
                    영업시간
                  </h3>
                  <p className="text-[#f5f6e4]">{selectedStore.hours}</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-[#b5b67d] mr-3 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-[#b5b67d] mb-1">
                    특징
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStore.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm rounded-full bg-[#2a2a2a] text-[#b5b67d]"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-[#b5b67d] mr-3 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-[#b5b67d] mb-1">
                    SNS
                  </h3>
                  <div className="flex gap-4">
                    {selectedStore.sns.homepage && (
                      <a
                        href={selectedStore.sns.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f5f6e4] hover:text-[#b5b67d] transition-colors"
                      >
                        홈페이지
                      </a>
                    )}
                    {selectedStore.sns.blog && (
                      <a
                        href={selectedStore.sns.blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f5f6e4] hover:text-[#b5b67d] transition-colors"
                      >
                        블로그
                      </a>
                    )}
                    {selectedStore.sns.instagram && (
                      <a
                        href={selectedStore.sns.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#f5f6e4] hover:text-[#b5b67d] transition-colors"
                      >
                        인스타그램
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-[#b5b67d] mr-3 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-[#b5b67d] mb-1">
                    지도
                  </h3>
                  <a
                    href={selectedStore.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f5f6e4] hover:text-[#b5b67d] transition-colors"
                  >
                    카카오맵에서 보기
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
