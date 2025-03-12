"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import BannerSlider from "@/components/home/BannerSlider";

// 스크롤 애니메이션을 위한 컴포넌트
function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [heroVideo, setHeroVideo] = useState<string | null>(null);
  const [useBannerSlider] = useState(true); // 배너 슬라이더 사용 여부

  // 히어로 영상 가져오기
  useEffect(() => {
    const fetchHeroVideo = async () => {
      try {
        const response = await fetch("/api/settings/hero-video");
        if (response.ok) {
          const data = await response.json();
          setHeroVideo(data.videoUrl);
        }
      } catch (error) {
        console.error("히어로 영상을 불러오는데 실패했습니다:", error);
      }
    };

    if (!useBannerSlider) {
      fetchHeroVideo();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 히어로 배너 섹션 */}
      <section className="relative h-[80vh] bg-gray-900 text-white overflow-hidden">
        {/* 배경 미디어 (배너 슬라이더 또는 비디오) */}
        <div className="absolute inset-0 z-0">
          {useBannerSlider ? (
            <BannerSlider />
          ) : (
            <>
              {heroVideo ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={heroVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-[#8a7e71] to-[#b5b67d]"></div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </>
          )}
        </div>

        {/* 히어로 콘텐츠 (배너 슬라이더를 사용하지 않을 때만 표시) */}
        {!useBannerSlider && (
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              건강한 몸과 마음을 위한 여정
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl mb-8 max-w-3xl"
            >
              바디앤솔에서 전문가와 함께 당신만의 건강한 라이프스타일을
              만들어보세요
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/center"
                className="bg-[#b5b67d] hover:bg-[#a0a169] text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                센터 이용하기
              </Link>
              <Link
                href="/academy"
                className="bg-transparent hover:bg-white hover:text-[#8a7e71] text-white font-bold py-3 px-6 rounded-lg border-2 border-white transition duration-300"
              >
                아카데미 교육 살펴보기
              </Link>
            </motion.div>
          </div>
        )}
      </section>

      {/* 아카데미 교육과정 하이라이트 섹션 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              인기 교육 과정
            </h2>
            <p className="text-gray-800 max-w-3xl mx-auto">
              바디앤솔 아카데미에서 제공하는 다양한 교육 과정을 통해 전문가로
              성장하세요
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 교육 과정 카드 1 */}
            <AnimatedSection className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative h-48 bg-[#f5f6e4]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="h-16 w-16 text-[#b5b67d]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  필라테스 강사 양성 과정
                </h3>
                <p className="text-gray-800 mb-4">
                  체계적인 커리큘럼으로 필라테스 전문 강사를 양성하는
                  과정입니다.
                </p>
                <Link
                  href="/courses/pilates-instructor"
                  className="text-[#8a7e71] font-semibold hover:text-[#b5b67d]"
                >
                  과정 상세 보기 &rarr;
                </Link>
              </div>
            </AnimatedSection>

            {/* 교육 과정 카드 2 */}
            <AnimatedSection className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative h-48 bg-[#f5f6e4]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="h-16 w-16 text-[#b5b67d]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  통증 교정 전문가 과정
                </h3>
                <p className="text-gray-800 mb-4">
                  근골격계 통증의 원인을 파악하고 교정하는 방법을 배우는
                  과정입니다.
                </p>
                <Link
                  href="/courses/pain-correction"
                  className="text-[#8a7e71] font-semibold hover:text-[#b5b67d]"
                >
                  과정 상세 보기 &rarr;
                </Link>
              </div>
            </AnimatedSection>

            {/* 교육 과정 카드 3 */}
            <AnimatedSection className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative h-48 bg-[#f5f6e4]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="h-16 w-16 text-[#b5b67d]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  재활 운동 지도사 과정
                </h3>
                <p className="text-gray-800 mb-4">
                  부상 후 재활 및 기능 회복을 위한 운동 프로그램을 설계하는
                  과정입니다.
                </p>
                <Link
                  href="/courses/rehabilitation"
                  className="text-[#8a7e71] font-semibold hover:text-[#b5b67d]"
                >
                  과정 상세 보기 &rarr;
                </Link>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection className="text-center mt-12">
            <Link
              href="/courses"
              className="bg-[#b5b67d] hover:bg-[#a0a169] text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              모든 교육 과정 보기
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* 이벤트·프로모션 영역 */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              이벤트 및 프로모션
            </h2>
            <p className="text-gray-800 max-w-3xl mx-auto">
              바디앤솔에서 진행 중인 특별한 이벤트와 프로모션을 확인하세요
            </p>
          </AnimatedSection>

          <AnimatedSection className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 relative h-64 md:h-auto bg-[#f5f6e4]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="h-24 w-24 text-[#b5b67d]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="uppercase tracking-wide text-sm text-[#8a7e71] font-semibold">
                  진행 중인 이벤트
                </div>
                <h3 className="text-2xl font-bold mt-2 mb-4">
                  여름 특별 프로모션
                </h3>
                <p className="text-gray-800 mb-6">
                  7월 한 달간 모든 교육 과정 10% 할인! 친구와 함께 등록 시 추가
                  5% 할인 혜택을 드립니다. 지금 바로 신청하고 특별한 혜택을
                  누려보세요.
                </p>
                <div className="flex items-center mb-6">
                  <div className="text-gray-700 mr-4">
                    <span className="font-bold">기간:</span> 2023년 7월 1일 ~
                    7월 31일
                  </div>
                </div>
                <Link
                  href="/events/summer-promotion"
                  className="bg-[#b5b67d] hover:bg-[#a0a169] text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  자세히 보기
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 학생 후기 섹션 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              학생 후기
            </h2>
            <p className="text-gray-800 max-w-3xl mx-auto">
              바디앤솔 아카데미 교육을 수료한 학생들의 생생한 후기를 확인하세요
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 후기 1 */}
            <AnimatedSection className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-[#f5f6e4] flex items-center justify-center mr-4">
                  <span className="text-[#8a7e71] font-bold">JK</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">김지현</h3>
                  <p className="text-sm text-gray-600">
                    필라테스 강사 양성 과정 수료
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-[#b5b67d]">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-800">
                &quot;바디앤솔 아카데미에서 배운 지식과 기술은 제 경력에 큰
                도움이 되었습니다. 전문적인 강사진과 체계적인 커리큘럼 덕분에
                자신감을 갖고 필라테스 강사로 활동할 수 있게 되었습니다.&quot;
              </p>
            </AnimatedSection>

            {/* 후기 2 */}
            <AnimatedSection className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-[#f5f6e4] flex items-center justify-center mr-4">
                  <span className="text-[#8a7e71] font-bold">SJ</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">이수진</h3>
                  <p className="text-sm text-gray-600">
                    통증 교정 전문가 과정 수료
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-[#b5b67d]">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-800">
                &quot;통증 교정 전문가 과정은 제가 기대했던 것보다 훨씬 더 많은
                것을 배울 수 있었습니다. 실습 위주의 교육과 개별 피드백 덕분에
                실제 현장에서 자신있게 적용할 수 있게 되었습니다.&quot;
              </p>
            </AnimatedSection>

            {/* 후기 3 */}
            <AnimatedSection className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-[#f5f6e4] flex items-center justify-center mr-4">
                  <span className="text-[#8a7e71] font-bold">DH</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">박동현</h3>
                  <p className="text-sm text-gray-600">
                    재활 운동 지도사 과정 수료
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex text-[#b5b67d]">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-800">
                &quot;바디앤솔 아카데미의 재활 운동 지도사 과정은 정말
                탁월했습니다. 이론과 실습이 균형 있게 구성되어 있어 실제
                현장에서 바로 적용할 수 있는 지식을 얻을 수 있었습니다.&quot;
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 문의 및 연락처 섹션 */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              문의하기
            </h2>
            <p className="text-gray-800 max-w-3xl mx-auto">
              바디앤솔 아카데미에 대해 더 알고 싶으신가요? 언제든지 문의해
              주세요.
            </p>
          </AnimatedSection>

          <div className="max-w-2xl mx-auto">
            <AnimatedSection className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                빠른 문의
              </h3>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    이름
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#b5b67d] focus:border-[#b5b67d]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    이메일
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#b5b67d] focus:border-[#b5b67d]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    전화번호
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#b5b67d] focus:border-[#b5b67d]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    문의 내용
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#b5b67d] focus:border-[#b5b67d]"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#b5b67d] hover:bg-[#a0a169] text-white font-bold py-2 px-4 rounded transition duration-300"
                  >
                    문의하기
                  </button>
                </div>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
