'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MediaUploader from '@/components/admin/MediaUploader';
import Image from 'next/image';

interface Media {
  id: string;
  type: string;
  url: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
  title: string | null;
  description: string | null;
  createdAt: string;
}

export default function AdminMedia() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  // 미디어 목록 불러오기
  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/media');
      
      if (!response.ok) {
        throw new Error('미디어 목록을 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setMediaList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '미디어 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user.role === 'admin') {
      fetchMedia();
    }
  }, [status, session]);

  // 로딩 중이거나 인증되지 않은 경우 처리
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 border-t-transparent" role="status">
            <span className="sr-only">로딩 중...</span>
          </div>
          <p className="mt-2">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session) {
    router.push('/admin/login');
    return null;
  }

  // 관리자가 아닌 경우 접근 제한
  if (session.user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">접근 권한이 없습니다</h1>
          <p className="mt-2">관리자만 접근할 수 있는 페이지입니다.</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  // 미디어 업로드 성공 처리
  const handleUploadSuccess = (media: {
    id: string;
    url: string;
    type: string;
    width: number;
    height: number;
    size: number;
    mimeType: string;
    title?: string;
  }) => {
    setMediaList([media as Media, ...mediaList]);
    setShowUploader(false);
  };

  // 미디어 삭제 처리
  const handleDeleteMedia = async (id: string) => {
    if (!confirm('정말로 이 미디어를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('미디어 삭제에 실패했습니다.');
      }

      setMediaList(mediaList.filter(media => media.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : '미디어 삭제 중 오류가 발생했습니다.');
    }
  };

  // 파일 크기 포맷팅
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">미디어 관리</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
            >
              대시보드로 돌아가기
            </button>
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              {showUploader ? '업로더 닫기' : '새 미디어 업로드'}
            </button>
          </div>
        </div>

        {showUploader && (
          <div className="mb-8">
            <MediaUploader onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600 border-t-transparent" role="status">
              <span className="sr-only">로딩 중...</span>
            </div>
            <p className="mt-2">미디어 목록을 불러오는 중...</p>
          </div>
        ) : mediaList.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">등록된 미디어가 없습니다.</p>
            <button
              onClick={() => setShowUploader(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
            >
              미디어 업로드하기
            </button>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    미디어
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    정보
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    크기
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    업로드 일시
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mediaList.map((media) => (
                  <tr key={media.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          {media.type === 'image' ? (
                            <Image 
                              src={media.url} 
                              alt={media.title || '이미지'} 
                              className="h-full w-full object-cover" 
                              width={64}
                              height={64}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-500">
                              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {media.title || '제목 없음'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {media.type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{media.width} x {media.height} 픽셀</div>
                      <div className="text-sm text-gray-500">{media.mimeType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(media.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(media.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteMedia(media.id)}
                        className="text-red-600 hover:text-red-900 ml-2"
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
    </div>
  );
} 