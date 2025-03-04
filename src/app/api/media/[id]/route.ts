import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // 세션 확인 (인증된 관리자만 접근 가능)
    const session = await getServerSession();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: '인증되지 않은 접근입니다.' },
        { status: 401 }
      );
    }

    const { id } = context.params;

    // 미디어 정보 조회
    const media = await prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json(
        { error: '미디어를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 파일 경로 추출
    const filePath = join(process.cwd(), 'public', media.url);

    try {
      // 파일 삭제
      await unlink(filePath);
    } catch (fileError) {
      console.error('파일 삭제 오류:', fileError);
      // 파일 삭제 실패해도 DB에서는 삭제 진행
    }

    // 데이터베이스에서 미디어 정보 삭제
    await prisma.media.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('미디어 삭제 오류:', error);
    return NextResponse.json(
      { error: '미디어 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 