"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BrandPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#b5b67d] mb-4">브랜드소개</h1>
        <div className="w-20 h-1 bg-[#b5b67d] mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative h-80 md:h-96 w-full rounded-lg overflow-hidden shadow-lg bg-white">
            <Image
              src="/brand_logo.png"
              alt="바디앤솔 브랜드 이미지"
              fill
              style={{ objectFit: "contain" }}
              className="rounded-lg p-4"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-[#b5b67d] mb-4">
            바디앤솔의 철학
          </h2>
          <p className="text-[#f5f6e4] mb-6 leading-relaxed">
            바디앤솔은 '건강한 몸과 마음의 조화'라는 철학을 바탕으로
            설립되었습니다. 우리는 단순한 외형적 아름다움을 넘어 내면의 건강과
            조화를 추구하며, 고객 한 분 한 분의 개성과 필요에 맞춘 맞춤형
            서비스를 제공합니다.
          </p>
          <p className="text-[#f5f6e4] mb-6 leading-relaxed">
            최신 트렌드와 검증된 전통 기법을 결합한 바디앤솔만의 특별한
            프로그램으로 고객님의 건강과 아름다움을 위한 최상의 솔루션을 제공해
            드립니다.
          </p>
        </motion.div>
      </div>

      <div className="bg-[#1a1a1a] p-8 rounded-lg mb-16">
        <h2 className="text-2xl font-semibold text-[#b5b67d] mb-6 text-center">
          브랜드 핵심 가치
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-[#2a2a2a] p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-16 h-16 bg-[#3a3a3a] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#b5b67d]"
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
            </div>
            <h3 className="text-xl font-medium text-[#b5b67d] mb-2 text-center">
              전문성
            </h3>
            <p className="text-[#f5f6e4] text-center">
              지속적인 교육과 연구를 통해 최고의 전문성을 갖춘 테라피스트가
              서비스를 제공합니다.
            </p>
          </motion.div>

          <motion.div
            className="bg-[#2a2a2a] p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="w-16 h-16 bg-[#3a3a3a] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#b5b67d]"
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
            <h3 className="text-xl font-medium text-[#b5b67d] mb-2 text-center">
              진정성
            </h3>
            <p className="text-[#f5f6e4] text-center">
              고객의 건강과 만족을 최우선으로 생각하며, 진심을 담은 서비스를
              제공합니다.
            </p>
          </motion.div>

          <motion.div
            className="bg-[#2a2a2a] p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="w-16 h-16 bg-[#3a3a3a] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-[#b5b67d]"
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
            <h3 className="text-xl font-medium text-[#b5b67d] mb-2 text-center">
              혁신
            </h3>
            <p className="text-[#f5f6e4] text-center">
              끊임없는 연구와 개발을 통해 최신 트렌드를 반영한 혁신적인
              프로그램을 제공합니다.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="text-center mb-8 bg-[#1a1a1a] p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-[#b5b67d] mb-4">
          바디앤솔과 함께하세요
        </h2>
        <p className="text-[#f5f6e4] max-w-3xl mx-auto mb-8">
          바디앤솔은 고객님의 건강과 아름다움을 위한 최고의 파트너가 되겠습니다.
          지금 바로 가까운 지점을 방문하시거나 상담을 신청하세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/center/locations"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#1a1a1a] bg-[#b5b67d] hover:bg-[#a5a66d]"
          >
            지점 안내
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-5 py-3 border border-[#b5b67d] text-base font-medium rounded-md text-[#b5b67d] bg-[#2a2a2a] hover:bg-[#3a3a3a]"
          >
            상담 신청
          </Link>
        </div>
      </div>
    </div>
  );
}
