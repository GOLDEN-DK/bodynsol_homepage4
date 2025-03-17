"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function CEOMessagePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-black">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#b5b67d] mb-4">대표 인사말</h1>
        <div className="w-20 h-1 bg-[#b5b67d] mx-auto"></div>
      </div>

      <div className="bg-[#1a1a1a] p-8 rounded-lg shadow-md mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <motion.div
            className="md:col-span-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-80 w-full md:h-96 rounded-lg overflow-hidden shadow-lg bg-[#2a2a2a]">
              <Image
                src="/ceo.png"
                alt="바디앤솔 대표"
                fill
                style={{ objectFit: "contain" }}
                className="rounded-lg p-4"
              />
            </div>
            <div className="text-center mt-4">
              <h3 className="text-xl font-semibold text-[#b5b67d]">배지원</h3>
              <p className="text-[#f5f6e4]">바디앤솔 대표</p>
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-lg font-medium text-[#b5b67d] mb-6">
                안녕하세요, 바디앤솔 대표 배지원입니다.
              </p>

              <p className="text-[#f5f6e4] mb-4 leading-relaxed">
                바디앤솔을 찾아주신 여러분께 진심으로 감사드립니다. 저희
                바디앤솔은 '건강한 몸과 마음의 조화'라는 철학을 바탕으로 고객님
                한 분 한 분의 건강과 아름다움을 위해 최선을 다하고 있습니다.
              </p>

              <p className="text-[#f5f6e4] mb-4 leading-relaxed">
                현대인들은 바쁜 일상 속에서 자신의 건강과 몸을 돌보는 시간이
                점점 부족해지고 있습니다. 바디앤솔은 이러한 현대인들에게
                잠시나마 일상에서 벗어나 자신을 위한 시간을 가질 수 있는 특별한
                공간이 되고자 합니다.
              </p>

              <p className="text-[#f5f6e4] mb-4 leading-relaxed">
                저희는 단순한 외형적 아름다움을 넘어 내면의 건강과 조화를
                추구합니다. 최고의 전문성을 갖춘 테라피스트들과 함께 고객님의
                개성과 필요에 맞는 맞춤형 서비스를 제공하기 위해 끊임없이
                연구하고 발전하고 있습니다.
              </p>

              <p className="text-[#f5f6e4] mb-4 leading-relaxed">
                바디앤솔은 앞으로도 고객님의 건강과 아름다움을 위한 최고의
                파트너가 되기 위해 최선을 다할 것을 약속드립니다. 여러분의 많은
                관심과 성원 부탁드립니다.
              </p>

              <p className="text-[#f5f6e4] mb-4 leading-relaxed">감사합니다.</p>

              <div className="mt-8 text-right">
                <p className="text-[#b5b67d] font-medium">바디앤솔 대표</p>
                <p className="text-xl font-semibold text-[#b5b67d]">배 지 원</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="text-center bg-[#1a1a1a] p-8 rounded-lg">
        <h2 className="text-2xl font-semibold text-[#b5b67d] mb-6">
          바디앤솔의 약속
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            className="bg-[#2a2a2a] p-6 rounded-lg shadow-md border-l-4 border-[#b5b67d]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl font-medium text-[#b5b67d] mb-3">
              최고의 품질
            </h3>
            <p className="text-[#f5f6e4]">
              최신 필라테스 기구와 전문적인 강사진을 통해 최고 품질의 수업을
              제공합니다. 고객님의 건강한 몸과 마음을 위해 끊임없이 연구하고
              발전하겠습니다.
            </p>
          </motion.div>

          <motion.div
            className="bg-[#2a2a2a] p-6 rounded-lg shadow-md border-l-4 border-[#b5b67d]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-medium text-[#b5b67d] mb-3">
              고객 중심
            </h3>
            <p className="text-[#f5f6e4]">
              고객님의 니즈와 피드백을 항상 경청하며, 개인별 맞춤 서비스를
              제공합니다. 고객님의 건강과 만족이 저희의 최우선 가치입니다.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
