import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Prisma Course 모델에 실제로 존재하는 필드만 사용
const databaseCourseFields = {
  title: true,
  slug: true,
  description: true,
  thumbnailUrl: true,
  thumbnailWidth: true,
  thumbnailHeight: true,
  category: true,
  curriculum: true,
  schedule: true,
  price: true,
  isActive: true,
};

// GET 요청 핸들러 - 모든 과정 조회
export async function GET(request: NextRequest) {
  try {
    // 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    
    // 조건부 필터 구성
    const where = categoryId ? { category: categoryId, isActive: true } : { isActive: true };
    
    // 과정 목록 조회
    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(courses);
  } catch (error) {
    console.error('과정 목록 조회 오류:', error);
    return NextResponse.json({ error: '과정 목록을 가져오는데 실패했습니다.' }, { status: 500 });
  }
}

// POST 요청 핸들러 - 새 과정 추가
export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
    }
    
    // 요청 본문 파싱
    const data = await request.json();
    console.log('받은 데이터:', data);
    
    // 필수 필드 검증
    if (!data.title || !data.slug || !data.description || !data.category || !data.thumbnailUrl) {
      return NextResponse.json({ error: '필수 항목이 누락되었습니다.' }, { status: 400 });
    }
    
    // content 필드가 있으면 curriculum으로 사용
    const curriculum = data.content || data.curriculum || null;
    
    // 과정 추가 (실제 모델에 있는 필드만 포함)
    const course = await prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        thumbnailWidth: data.thumbnailWidth || 800,
        thumbnailHeight: data.thumbnailHeight || 600,
        category: data.category,
        curriculum: curriculum,
        schedule: data.schedule || null,
        price: data.price ? parseInt(data.price) : null,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
    
    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    console.error('과정 추가 오류:', error);
    
    // 중복 슬러그 오류 처리
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return NextResponse.json({ error: '이미 사용 중인 슬러그입니다. 다른 슬러그를 사용해주세요.' }, { status: 400 });
    }
    
    return NextResponse.json({ error: '과정 추가에 실패했습니다.' }, { status: 500 });
  }
}
