'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface MediaUploaderProps {
  onUploadSuccess: (media: {
    id: string;
    url: string;
    type: string;
    width: number;
    height: number;
    size: number;
    mimeType: string;
    title?: string;
  }) => void;
}

export default function MediaUploader({ onUploadSuccess }: MediaUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 파일 크기 제한 (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    }

    // 지원하는 파일 형식 확인
    const fileType = selectedFile.type;
    if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
      setError('이미지 또는 비디오 파일만 업로드할 수 있습니다.');
      return;
    }

    setFile(selectedFile);
    setError(null);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);

    // 이미지 크기 확인
    if (fileType.startsWith('image/')) {
      const img = new window.Image();
      img.onload = () => {
        setDimensions({
          width: img.width,
          height: img.height,
        });
      };
      img.src = URL.createObjectURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('업로드할 파일을 선택해주세요.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);

      // 서버에 업로드 요청
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('파일 업로드에 실패했습니다.');
      }

      const data = await response.json();
      onUploadSuccess(data);

      // 폼 초기화
      setFile(null);
      setPreview(null);
      setTitle('');
      setDescription('');
      setDimensions(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">미디어 업로드</h3>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          파일 선택
        </label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*,video/*"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="mt-1 text-xs text-gray-500">
          최대 10MB, 이미지 또는 비디오 파일만 업로드 가능합니다.
        </p>
      </div>

      {preview && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            미리보기
          </label>
          <div className="border rounded-md p-2">
            {file?.type.startsWith('image/') ? (
              <Image
                src={preview || ''}
                alt="미리보기"
                className="max-h-48 max-w-full mx-auto"
                width={200}
                height={200}
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <video
                src={preview}
                controls
                className="max-h-48 max-w-full mx-auto"
              />
            )}
            {dimensions && (
              <p className="text-xs text-gray-500 text-center mt-2">
                크기: {dimensions.width} x {dimensions.height} 픽셀
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          제목 (선택사항)
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          설명 (선택사항)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isUploading ? '업로드 중...' : '업로드'}
      </button>
    </div>
  );
} 