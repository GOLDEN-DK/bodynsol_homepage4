"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  createdAt: string;
  mediaType: string;
  transitionTime: number;
}

export default function AdminBanners() {
  const { status } = useSession();
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [newBanner, setNewBanner] = useState({
    title: "",
    description: "",
    imageUrl: "",
    link: "",
    isActive: true,
    order: 0,
    mediaType: "image",
    imageWidth: 1920,
    imageHeight: 600,
    transitionTime: 5,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [useDirectUrl, setUseDirectUrl] = useState(false);
  const [showUrlPreview, setShowUrlPreview] = useState(false);

  // 배너 목록 불러오기
  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/banners");

      if (!response.ok) {
        throw new Error("배너 목록을 불러오는데 실패했습니다.");
      }

      const data = await response.json();
      setBanners(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "배너 목록을 불러오는 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    } else if (status === "authenticated") {
      fetchBanners();
    }
  }, [status, router]);

  // 이미지 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 파일 확장자에 따라 mediaType 자동 설정
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith(".gif")) {
        setNewBanner((prev) => ({ ...prev, mediaType: "gif" }));
      } else if (
        fileName.endsWith(".mp4") ||
        fileName.endsWith(".webm") ||
        fileName.endsWith(".mov")
      ) {
        setNewBanner((prev) => ({ ...prev, mediaType: "video" }));
      } else {
        setNewBanner((prev) => ({ ...prev, mediaType: "image" }));
      }
    }
  };

  // 폼 입력 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setNewBanner((prev) => ({ ...prev, [name]: checked }));
    } else {
      setNewBanner((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 배너 추가 핸들러
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();

    // 파일 업로드 또는 직접 URL 입력 중 하나는 필수
    if (!selectedImage && !useDirectUrl) {
      alert("이미지를 선택하거나 미디어 URL을 입력해주세요.");
      return;
    }

    if (useDirectUrl && !newBanner.imageUrl) {
      alert("미디어 URL을 입력해주세요.");
      return;
    }

    try {
      let bannerData = { ...newBanner };

      // 파일 업로드 방식인 경우
      if (!useDirectUrl && selectedImage) {
        // 이미지 업로드
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("type", newBanner.mediaType);
        formData.append("title", newBanner.title);

        const uploadResponse = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("미디어 업로드에 실패했습니다.");
        }

        const uploadData = await uploadResponse.json();

        // 배너 데이터 업데이트
        bannerData = {
          ...newBanner,
          imageUrl: uploadData.url,
          imageWidth: uploadData.width,
          imageHeight: uploadData.height,
        };
      } else {
        // 직접 URL 입력 방식인 경우
        // 기본 이미지 크기 설정
        bannerData = {
          ...newBanner,
          imageWidth: 1920,
          imageHeight: 600,
        };
      }

      // 배너 추가 API 호출
      const response = await fetch("/api/banners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bannerData),
      });

      if (!response.ok) {
        throw new Error("배너 추가에 실패했습니다.");
      }

      // 성공 시 폼 초기화 및 목록 새로고침
      setNewBanner({
        title: "",
        description: "",
        imageUrl: "",
        link: "",
        isActive: true,
        order: 0,
        mediaType: "image",
        imageWidth: 1920,
        imageHeight: 600,
        transitionTime: 5,
      });
      setSelectedImage(null);
      setPreviewUrl(null);
      setUseDirectUrl(false);
      setShowUrlPreview(false);
      setShowAddForm(false);
      fetchBanners();

      alert("배너가 성공적으로 추가되었습니다.");
    } catch (error) {
      alert("배너 추가 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  // 배너 삭제 핸들러
  const handleDeleteBanner = async (id: string) => {
    if (!confirm("정말로 이 배너를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("배너 삭제에 실패했습니다.");
      }

      fetchBanners();
      alert("배너가 성공적으로 삭제되었습니다.");
    } catch (error) {
      alert("배너 삭제 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  // 배너 활성화/비활성화 토글 핸들러
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("배너 상태 변경에 실패했습니다.");
      }

      fetchBanners();
    } catch (error) {
      alert("배너 상태 변경 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  // URL 미리보기 핸들러
  const handlePreviewUrl = () => {
    if (newBanner.imageUrl) {
      setShowUrlPreview(true);
    } else {
      alert("미리보기할 URL을 입력해주세요.");
    }
  };

  // 배너 수정 핸들러
  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setShowEditForm(true);
  };

  // 배너 수정 저장 핸들러
  const handleSaveEdit = async () => {
    if (!editingBanner) return;

    try {
      const response = await fetch(`/api/banners/${editingBanner.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editingBanner.title,
          description: editingBanner.description,
          link: editingBanner.link,
          isActive: editingBanner.isActive,
          order: editingBanner.order,
          transitionTime: editingBanner.transitionTime,
        }),
      });

      if (!response.ok) {
        throw new Error("배너 수정에 실패했습니다.");
      }

      fetchBanners();
      setShowEditForm(false);
      setEditingBanner(null);
      alert("배너가 성공적으로 수정되었습니다.");
    } catch (error) {
      alert("배너 수정 중 오류가 발생했습니다.");
      console.error(error);
    }
  };

  // 수정 폼 입력 핸들러
  const handleEditInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setEditingBanner((prev) => (prev ? { ...prev, [name]: checked } : null));
    } else if (type === "number") {
      setEditingBanner((prev) =>
        prev ? { ...prev, [name]: parseInt(value) || 0 } : null
      );
    } else {
      setEditingBanner((prev) => (prev ? { ...prev, [name]: value } : null));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">배너 관리</h1>
        <div className="flex gap-4">
          <Link
            href="/admin/dashboard"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            대시보드로 돌아가기
          </Link>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {showAddForm ? "취소" : "새 배너 추가"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* 배너 추가 폼 */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">새 배너 추가</h2>
          <form onSubmit={handleAddBanner}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="title"
                  >
                    제목 *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={newBanner.title}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="description"
                  >
                    설명
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newBanner.description}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows={3}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="link"
                  >
                    링크 URL
                  </label>
                  <input
                    id="link"
                    name="link"
                    type="text"
                    value={newBanner.link}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="https://"
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="order"
                  >
                    표시 순서
                  </label>
                  <input
                    id="order"
                    name="order"
                    type="number"
                    value={newBanner.order}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    min="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    숫자가 작을수록 먼저 표시됩니다.
                  </p>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="transitionTime"
                  >
                    전환 시간(초)
                  </label>
                  <input
                    id="transitionTime"
                    name="transitionTime"
                    type="number"
                    value={newBanner.transitionTime}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    min="1"
                    max="60"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    배너가 다음 배너로 전환되는 시간을 초 단위로 설정합니다.
                    (1~60초)
                  </p>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="mediaType"
                  >
                    미디어 타입 *
                  </label>
                  <select
                    id="mediaType"
                    name="mediaType"
                    value={newBanner.mediaType}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="image">이미지 (JPG, PNG)</option>
                    <option value="gif">GIF 애니메이션</option>
                    <option value="video">비디오 (MP4, WebM)</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    {newBanner.mediaType === "video"
                      ? "비디오 파일은 MP4, WebM, MOV 형식을 지원합니다. 최대 10MB까지 업로드 가능합니다."
                      : newBanner.mediaType === "gif"
                      ? "GIF 애니메이션을 지원합니다. 최대 10MB까지 업로드 가능합니다."
                      : "JPG, PNG 등의 정적 이미지 파일을 지원합니다. 최대 10MB까지 업로드 가능합니다."}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    권장 크기: 1920 x 600 픽셀 (가로 x 세로)
                  </p>
                </div>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={newBanner.isActive}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-gray-700 text-sm font-bold">
                      활성화
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    미디어 추가 방식
                  </label>
                  <div className="flex items-center mb-2">
                    <input
                      id="upload-file"
                      type="radio"
                      name="mediaAddType"
                      checked={!useDirectUrl}
                      onChange={() => setUseDirectUrl(false)}
                      className="mr-2"
                    />
                    <label htmlFor="upload-file" className="text-gray-700">
                      파일 업로드
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="direct-url"
                      type="radio"
                      name="mediaAddType"
                      checked={useDirectUrl}
                      onChange={() => setUseDirectUrl(true)}
                      className="mr-2"
                    />
                    <label htmlFor="direct-url" className="text-gray-700">
                      URL 직접 입력
                    </label>
                  </div>
                </div>

                {useDirectUrl ? (
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="directImageUrl"
                    >
                      미디어 URL *
                    </label>
                    <div className="flex">
                      <input
                        id="directImageUrl"
                        name="imageUrl"
                        type="text"
                        value={newBanner.imageUrl}
                        onChange={(e) => {
                          handleInputChange(e);
                          setShowUrlPreview(false); // URL이 변경되면 미리보기 초기화
                        }}
                        className="shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="https://"
                        required={useDirectUrl}
                      />
                      <button
                        type="button"
                        onClick={handlePreviewUrl}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r"
                      >
                        미리보기
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      외부 이미지 또는 비디오 URL을 입력하세요. 권장 크기: 1920
                      x 600 픽셀
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="image"
                    >
                      배너 미디어 파일 *
                    </label>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept={
                        newBanner.mediaType === "video"
                          ? "video/mp4,video/webm,video/mov"
                          : newBanner.mediaType === "gif"
                          ? "image/gif"
                          : "image/jpeg,image/png,image/jpg"
                      }
                      onChange={handleImageChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required={!useDirectUrl}
                    />
                  </div>
                )}

                {previewUrl && !useDirectUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-bold mb-2">미디어 미리보기:</p>
                    <div className="relative h-40 bg-gray-100 rounded overflow-hidden">
                      {newBanner.mediaType === "video" ? (
                        <video
                          src={previewUrl}
                          controls
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Image
                          src={previewUrl}
                          alt="배너 미리보기"
                          fill
                          style={{ objectFit: "contain" }}
                          unoptimized={newBanner.mediaType === "gif"}
                        />
                      )}
                    </div>
                  </div>
                )}

                {useDirectUrl && showUrlPreview && newBanner.imageUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-bold mb-2">URL 미리보기:</p>
                    <div className="relative h-40 bg-gray-100 rounded overflow-hidden">
                      {newBanner.mediaType === "video" ? (
                        <video
                          src={newBanner.imageUrl}
                          controls
                          className="w-full h-full object-contain"
                          onError={() => {
                            alert(
                              "비디오 URL을 불러올 수 없습니다. URL을 확인해주세요."
                            );
                            setShowUrlPreview(false);
                          }}
                        />
                      ) : (
                        <div
                          className="absolute inset-0 w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${newBanner.imageUrl})`,
                          }}
                        >
                          <Image
                            src={newBanner.imageUrl}
                            alt="배너 미리보기"
                            fill
                            style={{ objectFit: "contain" }}
                            unoptimized={true}
                            onError={() => {
                              alert(
                                "이미지 URL을 불러올 수 없습니다. URL을 확인해주세요."
                              );
                              setShowUrlPreview(false);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                취소
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                배너 추가
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 배너 수정 모달 */}
      {showEditForm && editingBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">배너 수정</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="edit-title"
                  >
                    제목 *
                  </label>
                  <input
                    id="edit-title"
                    name="title"
                    type="text"
                    value={editingBanner.title}
                    onChange={handleEditInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="edit-description"
                  >
                    설명
                  </label>
                  <textarea
                    id="edit-description"
                    name="description"
                    value={editingBanner.description || ""}
                    onChange={handleEditInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows={3}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="edit-link"
                  >
                    링크 URL
                  </label>
                  <input
                    id="edit-link"
                    name="link"
                    type="text"
                    value={editingBanner.link || ""}
                    onChange={handleEditInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="https://"
                  />
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="edit-order"
                  >
                    표시 순서
                  </label>
                  <input
                    id="edit-order"
                    name="order"
                    type="number"
                    value={editingBanner.order}
                    onChange={handleEditInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    min="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    숫자가 작을수록 먼저 표시됩니다.
                  </p>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="edit-transitionTime"
                  >
                    전환 시간(초)
                  </label>
                  <input
                    id="edit-transitionTime"
                    name="transitionTime"
                    type="number"
                    value={editingBanner.transitionTime || 5}
                    onChange={handleEditInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    min="1"
                    max="60"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    배너가 다음 배너로 전환되는 시간을 초 단위로 설정합니다.
                    (1~60초)
                  </p>
                </div>

                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={editingBanner.isActive}
                      onChange={handleEditInputChange}
                      className="mr-2"
                    />
                    <span className="text-gray-700 text-sm font-bold">
                      활성화
                    </span>
                  </label>
                </div>

                <div className="mb-4">
                  <p className="block text-gray-700 text-sm font-bold mb-2">
                    미디어 타입
                  </p>
                  <p className="text-sm text-gray-500">
                    {editingBanner.mediaType === "video"
                      ? "비디오"
                      : editingBanner.mediaType === "gif"
                      ? "GIF 애니메이션"
                      : "이미지"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    미디어 타입은 변경할 수 없습니다. 변경이 필요한 경우 새
                    배너를 추가해주세요.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingBanner(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 배너 목록 */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">배너 목록을 불러오는 중...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-500 mb-4">등록된 배너가 없습니다.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            첫 배너 추가하기
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  미디어
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  제목
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  링크
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  타입
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  순서
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  전환 시간
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  상태
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.map((banner) => (
                <tr key={banner.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative h-16 w-32 bg-gray-100 rounded overflow-hidden">
                      {banner.mediaType === "video" ? (
                        <video
                          src={banner.imageUrl}
                          muted
                          loop
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${banner.imageUrl})` }}
                        >
                          <Image
                            src={banner.imageUrl}
                            alt={banner.title}
                            fill
                            style={{ objectFit: "cover" }}
                            unoptimized={true}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {banner.title}
                    </div>
                    {banner.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {banner.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {banner.link ? (
                      <a
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {banner.link.length > 30
                          ? `${banner.link.substring(0, 30)}...`
                          : banner.link}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">링크 없음</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {banner.mediaType === "video"
                      ? "비디오"
                      : banner.mediaType === "gif"
                      ? "GIF"
                      : "이미지"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {banner.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {banner.transitionTime || 5}초
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        banner.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {banner.isActive ? "활성화" : "비활성화"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditBanner(banner)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      수정
                    </button>
                    <button
                      onClick={() =>
                        handleToggleActive(banner.id, banner.isActive)
                      }
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      {banner.isActive ? "비활성화" : "활성화"}
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
