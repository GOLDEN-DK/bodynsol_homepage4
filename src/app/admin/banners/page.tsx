'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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
}

export default function AdminBanners() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    isActive: true,
    order: 0
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 배너 목록 불러오기
  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/banners');
      
      if (!response.ok) {
        throw new Error('배너 목록을 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setBanners(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '배너 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
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
    }
  };

  // 폼 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setNewBanner(prev => ({ ...prev, [name]: checked }));
    } else {
      setNewBanner(prev => ({ ...prev, [name]: value }));
    }
  };

  // 배너 추가 핸들러
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      alert('이미지를 선택해주세요.');
      return;
    }
    
    try {
      // 이미지 업로드
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('type', 'image');
      formData.append('title', newBanner.title);
      
      const uploadResponse = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }
      
      const uploadData = await uploadResponse.json();
      
      // 배너 데이터 생성
      const bannerData = {
        ...newBanner,
        imageUrl: uploadData.url,
        imageWidth: uploadData.width,
        imageHeight: uploadData.height
      };
      
      // 배너 추가 API 호출
      const response = await fetch('/api/banners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData),
      });
      
      if (!response.ok) {
        throw new Error('배너 추가에 실패했습니다.');
      }
      
      // 성공 시 폼 초기화 및 목록 새로고침
      setNewBanner({
        title: '',
        description: '',
        imageUrl: '',
        link: '',
        isActive: true,
        order: 0
      });
      setSelectedImage(null);
      setPreviewUrl(null);
      setShowAddForm(false);
      fetchBanners();
      
      alert('배너가 성공적으로 추가되었습니다.');
    } catch (error) {
      alert('배너 추가 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  // 배너 삭제 핸들러
  const handleDeleteBanner = async (id: string) => {
    if (!confirm('정말로 이 배너를 삭제하시겠습니까?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('배너 삭제에 실패했습니다.');
      }
      
      fetchBanners();
      alert('배너가 성공적으로 삭제되었습니다.');
    } catch (error) {
      alert('배너 삭제 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  // 배너 활성화/비활성화 토글 핸들러
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      
      if (!response.ok) {
        throw new Error('배너 상태 변경에 실패했습니다.');
      }
      
      fetchBanners();
    } catch (error) {
      alert('배너 상태 변경 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">배너 관리</h1>
        <div className="flex gap-4">
          <Link href="/admin/dashboard" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
            대시보드로 돌아가기
          </Link>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {showAddForm ? '취소' : '새 배너 추가'}
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="link">
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
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="order">
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
                  <p className="text-sm text-gray-500 mt-1">숫자가 작을수록 먼저 표시됩니다.</p>
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
                    <span className="text-gray-700 text-sm font-bold">활성화</span>
                  </label>
                </div>
              </div>
              
              <div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                    배너 이미지 *
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">권장 크기: 1920x600 픽셀</p>
                </div>
                
                {previewUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-bold mb-2">이미지 미리보기:</p>
                    <div className="relative h-40 bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={previewUrl}
                        alt="배너 미리보기"
                        fill
                        style={{ objectFit: 'contain' }}
                      />
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이미지
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제목
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  링크
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  순서
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {banners.map((banner) => (
                <tr key={banner.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative h-16 w-32 bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                    {banner.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">{banner.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {banner.link ? (
                      <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                        {banner.link.length > 30 ? `${banner.link.substring(0, 30)}...` : banner.link}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">링크 없음</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {banner.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        banner.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {banner.isActive ? '활성화' : '비활성화'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleToggleActive(banner.id, banner.isActive)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      {banner.isActive ? '비활성화' : '활성화'}
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