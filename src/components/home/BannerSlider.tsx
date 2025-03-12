"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Banner {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  link: string | null;
  isActive: boolean;
  order: number;
  mediaType: string; // 'image', 'gif', 'video' 중 하나
  transitionTime: number; // 배너 전환 시간(초)
}

export default function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 배너 데이터 가져오기
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/banners");

        if (!response.ok) {
          throw new Error("배너를 불러오는데 실패했습니다.");
        }

        const data = await response.json();
        // 활성화된 배너만 필터링
        const activeBanners = data.filter((banner: Banner) => banner.isActive);
        // 순서대로 정렬
        const sortedBanners = activeBanners.sort(
          (a: Banner, b: Banner) => a.order - b.order
        );
        setBanners(sortedBanners);

        // 배너 URL 디버깅
        if (sortedBanners.length > 0) {
          sortedBanners.forEach((banner: Banner) => {
            console.log(
              `배너 [${banner.title}] URL: ${banner.imageUrl}, 타입: ${banner.mediaType}`
            );
          });
        }
      } catch (err) {
        console.error("배너 로딩 오류:", err);
        setError(
          err instanceof Error
            ? err.message
            : "배너를 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // 자동 슬라이드 기능
  useEffect(() => {
    if (banners.length <= 1) return;

    // 현재 배너의 전환 시간을 가져옴 (초 단위)
    const currentTransitionTime = banners[currentIndex].transitionTime || 5;
    // 밀리초로 변환
    const transitionTimeMs = currentTransitionTime * 1000;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, transitionTimeMs); // 설정된 시간마다 슬라이드 변경

    return () => clearInterval(interval);
  }, [banners.length, currentIndex, banners]);

  // 다음 배너로 이동
  const nextBanner = () => {
    if (banners.length <= 1) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  // 이전 배너로 이동
  const prevBanner = () => {
    if (banners.length <= 1) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + banners.length) % banners.length
    );
  };

  // 특정 배너로 이동
  const goToBanner = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(to right, #8a7e71, #b5b67d)",
        }}
      ></div>
    );
  }

  if (error || banners.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(to right, #8a7e71, #b5b67d)",
        }}
      ></div>
    );
  }

  const currentBanner = banners[currentIndex];
  const isVideo = currentBanner.mediaType === "video";
  const isGif =
    currentBanner.mediaType === "gif" ||
    currentBanner.imageUrl.toLowerCase().endsWith(".gif");

  // Wix 비디오 URL 처리
  let videoUrl = currentBanner.imageUrl;

  // Wix 비디오 URL 수정 (file.mp4가 아닌 경우 처리)
  if (
    isVideo &&
    videoUrl.includes("wixstatic.com") &&
    !videoUrl.endsWith("/file.mp4")
  ) {
    // URL 끝에 /file.mp4가 없으면 추가
    if (!videoUrl.endsWith(".mp4")) {
      if (videoUrl.endsWith("/")) {
        videoUrl = videoUrl + "file.mp4";
      } else {
        videoUrl = videoUrl + "/file.mp4";
      }
    }
  }

  // URL에 쿼리 파라미터 제거 (Wix 비디오 URL에 문제가 있을 수 있음)
  if (isVideo && videoUrl.includes("?")) {
    videoUrl = videoUrl.split("?")[0];
  }

  console.log("현재 배너 정보:", {
    id: currentBanner.id,
    title: currentBanner.title,
    imageUrl: currentBanner.imageUrl,
    videoUrl: isVideo ? videoUrl : null,
    mediaType: currentBanner.mediaType,
    isVideo,
    isGif,
  });

  // 배경 스타일
  const backgroundStyle = isVideo
    ? { backgroundColor: "#000" }
    : {
        backgroundImage: `url(${currentBanner.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#333",
      };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* 배경 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          ...backgroundStyle,
        }}
      >
        {/* 비디오 배경 */}
        {isVideo && (
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => console.error("비디오 로드 오류:", e)}
          />
        )}
      </div>

      {/* 오버레이 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      ></div>

      {/* 콘텐츠 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          padding: "0 1rem",
          zIndex: 2,
        }}
      >
        <h2
          style={{
            fontSize: "clamp(2rem, 5vw, 3.75rem)",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          {currentBanner.title}
        </h2>

        {currentBanner.description && (
          <p
            style={{
              fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
              marginBottom: "2rem",
              maxWidth: "48rem",
            }}
          >
            {currentBanner.description}
          </p>
        )}

        {currentBanner.link && (
          <Link
            href={currentBanner.link}
            style={{
              backgroundColor: "#b5b67d",
              color: "white",
              fontWeight: "bold",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              transition: "background-color 0.3s",
              textDecoration: "none",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#a0a169";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#b5b67d";
            }}
          >
            자세히 보기
          </Link>
        )}
      </div>

      {/* 네비게이션 버튼 */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevBanner}
            style={{
              position: "absolute",
              left: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
              zIndex: 10,
            }}
            aria-label="이전 배너"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextBanner}
            style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
              zIndex: 10,
            }}
            aria-label="다음 배너"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* 인디케이터 */}
          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "0.5rem",
              zIndex: 10,
            }}
          >
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToBanner(index)}
                style={{
                  width: "0.75rem",
                  height: "0.75rem",
                  borderRadius: "50%",
                  backgroundColor:
                    index === currentIndex
                      ? "white"
                      : "rgba(255, 255, 255, 0.5)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
                aria-label={`${index + 1}번 배너로 이동`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
