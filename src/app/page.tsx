import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 히어로 배너 섹션 */}
      <section className="relative h-[80vh] bg-gray-900 text-white">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-r from-blue-900 to-indigo-900"></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">건강한 몸과 마음을 위한 여정</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl">
            바디앤솔에서 전문가와 함께 당신만의 건강한 라이프스타일을 만들어보세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/center" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              센터 이용하기
            </Link>
            <Link href="/academy" className="bg-transparent hover:bg-white hover:text-blue-600 text-white font-bold py-3 px-6 rounded-lg border-2 border-white transition duration-300">
              아카데미 교육 살펴보기
            </Link>
          </div>
        </div>
      </section>

      {/* 아카데미 교육과정 하이라이트 섹션 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">인기 교육 과정</h2>
            <p className="text-gray-800 max-w-3xl mx-auto">
              바디앤솔 아카데미에서 제공하는 다양한 교육 과정을 통해 전문가로 성장하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 교육 과정 카드 1 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative h-48 bg-blue-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">필라테스 강사 양성 과정</h3>
                <p className="text-gray-800 mb-4">
                  체계적인 커리큘럼으로 필라테스 전문 강사를 양성하는 과정입니다.
                </p>
                <Link href="/courses/pilates-instructor" className="text-blue-600 font-semibold hover:text-blue-800">
                  과정 상세 보기 &rarr;
                </Link>
              </div>
            </div>

            {/* 교육 과정 카드 2 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative h-48 bg-green-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">통증 교정 전문가 과정</h3>
                <p className="text-gray-800 mb-4">
                  근골격계 통증의 원인을 파악하고 교정하는 방법을 배우는 과정입니다.
                </p>
                <Link href="/courses/pain-correction" className="text-blue-600 font-semibold hover:text-blue-800">
                  과정 상세 보기 &rarr;
                </Link>
              </div>
            </div>

            {/* 교육 과정 카드 3 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative h-48 bg-purple-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-16 w-16 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">재활 운동 지도사 과정</h3>
                <p className="text-gray-800 mb-4">
                  부상 후 재활 및 기능 회복을 위한 운동 프로그램을 설계하는 과정입니다.
                </p>
                <Link href="/courses/rehabilitation" className="text-blue-600 font-semibold hover:text-blue-800">
                  과정 상세 보기 &rarr;
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/courses" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              모든 교육 과정 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 이벤트·프로모션 영역 */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">이벤트 및 프로모션</h2>
            <p className="text-gray-800 max-w-3xl mx-auto">
              바디앤솔에서 진행 중인 특별한 이벤트와 프로모션을 확인하세요
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 relative h-64 md:h-auto bg-yellow-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="h-24 w-24 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">진행 중인 이벤트</div>
                <h3 className="text-2xl font-bold mt-2 mb-4">여름 특별 프로모션</h3>
                <p className="text-gray-800 mb-6">
                  7월 한 달간 모든 교육 과정 10% 할인! 친구와 함께 등록 시 추가 5% 할인 혜택을 드립니다.
                  지금 바로 신청하고 특별한 혜택을 누려보세요.
                </p>
                <div className="flex items-center mb-6">
                  <div className="text-gray-700 mr-4">
                    <span className="font-bold">기간:</span> 2023년 7월 1일 ~ 7월 31일
                  </div>
                </div>
                <Link href="/events/summer-promotion" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                  자세히 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 수강생 후기 & 리뷰 섹션 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">수강생 후기</h2>
            <p className="text-gray-800 max-w-3xl mx-auto">
              바디앤솔 아카데미의 교육을 경험한 수강생들의 생생한 후기를 확인하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 후기 카드 1 */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl mr-4">
                  K
                </div>
                <div>
                  <h4 className="font-bold">김지영</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-800 mb-4">
                "필라테스 강사 양성 과정을 통해 전문적인 지식과 실무 경험을 쌓을 수 있었습니다. 강사진의 꼼꼼한 지도 덕분에 자신감을 갖고 현장에서 활동할 수 있게 되었습니다."
              </p>
              <p className="text-sm text-gray-700">필라테스 강사 양성 과정 수료</p>
            </div>
            
            {/* 후기 카드 2 */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl mr-4">
                  L
                </div>
                <div>
                  <h4 className="font-bold">이상호</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-800 mb-4">
                "통증 교정 전문가 과정은 제 물리치료사 경력에 큰 도움이 되었습니다. 이론과 실습이 균형 있게 구성되어 있어 실제 환자 치료에 바로 적용할 수 있었습니다."
              </p>
              <p className="text-sm text-gray-700">통증 교정 전문가 과정 수료</p>
            </div>
            
            {/* 후기 카드 3 */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xl mr-4">
                  P
                </div>
                <div>
                  <h4 className="font-bold">박미라</h4>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-800 mb-4">
                "재활 운동 지도사 과정을 통해 다양한 케이스에 대응할 수 있는 능력을 키울 수 있었습니다. 특히 실제 사례 분석과 맞춤형 프로그램 설계 부분이 매우 유익했습니다."
              </p>
              <p className="text-sm text-gray-700">재활 운동 지도사 과정 수료</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/community/reviews" className="text-blue-600 font-semibold hover:text-blue-800">
              더 많은 후기 보기 &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 상담/문의 섹션 */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">상담 및 문의</h2>
            <p className="text-gray-800 max-w-3xl mx-auto">
              바디앤솔 센터 이용 및 아카데미 교육 과정에 대해 궁금한 점이 있으신가요?
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이름을 입력하세요"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="연락처를 입력하세요"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">문의 내용</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="문의 내용을 입력하세요"
                  required
                ></textarea>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  문의하기
                </button>
              </div>
            </form>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">전화 문의</h4>
                  <p className="text-gray-600">010-8206-2729</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">이메일 문의</h4>
                  <p className="text-gray-600">dreambody2728@naver.com</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">카카오톡 문의</h4>
                  <p className="text-gray-600">@bodynsol</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
