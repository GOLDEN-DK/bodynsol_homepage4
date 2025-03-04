import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // 세션 확인 (인증된 관리자만 접근 가능)
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: '인증되지 않은 접근입니다.' },
        { status: 401 }
      );
    }

    // multipart/form-data 처리
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 파일 타입 확인
    const fileType = file.type;
    if (!fileType.startsWith('image/') && !fileType.startsWith('video/')) {
      return NextResponse.json(
        { error: '이미지 또는 비디오 파일만 업로드할 수 있습니다.' },
        { status: 400 }
      );
    }

    // 파일 크기 확인 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 10MB를 초과할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 파일 저장 경로 설정
    const mediaType = fileType.startsWith('image/') ? 'images' : 'videos';
    const uploadDir = join(process.cwd(), 'public', 'uploads', mediaType);
    
    // 디렉토리가 없으면 생성
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('디렉토리 생성 오류:', error);
    }

    // 파일명 생성 (고유 ID + 원본 확장자)
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);
    
    // 파일 저장
    const fileBuffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(fileBuffer));

    // 파일 URL 생성
    const fileUrl = `/uploads/${mediaType}/${fileName}`;

    // 파일 메타데이터 (이미지 크기 등)
    let width = 0;
    let height = 0;

    // TODO: 이미지/비디오 크기 측정 로직 추가
    // 실제 구현에서는 이미지 처리 라이브러리(예: sharp)를 사용하여 크기를 측정

    // 데이터베이스에 미디어 정보 저장
    const media = await prisma.media.create({
      data: {
        type: mediaType === 'images' ? 'image' : 'video',
        url: fileUrl,
        width,
        height,
        size: file.size,
        mimeType: fileType,
        title: formData.get('title') as string || null,
        description: formData.get('description') as string || null,
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error('미디어 업로드 오류:', error);
    return NextResponse.json(
      { error: '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 