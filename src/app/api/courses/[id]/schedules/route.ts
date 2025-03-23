import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

// 일정 인터페이스 정의
interface ScheduleItem {
  id: string;
  startDate: string; // ISO 문자열
  endDate: string; // ISO 문자열
  location: string;
  teachers: string[]; // 강사 ID 배열
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paramsValues = await params;
    const courseId = paramsValues.id;

    // 과정 존재 여부 확인
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: '과정을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 일정 데이터 파싱
    let schedules: ScheduleItem[] = [];
    if (course.schedule) {
      try {
        schedules = JSON.parse(course.schedule);
        // 날짜순으로 정렬
        schedules.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      } catch (e) {
        console.error('일정 데이터 파싱 오류:', e);
      }
    }

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('일정 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '일정 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: '권한이 없습니다.' },
        { status: 403 }
      );
    }

    const paramsValues = await params;
    const courseId = paramsValues.id;

    // 과정 존재 여부 확인
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { error: '과정을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { startDate, endDate, location, teachers } = body;

    // 필수 필드 검증
    if (!startDate || !endDate || !location) {
      return NextResponse.json(
        { error: '시작일, 종료일, 장소는 필수 항목입니다.' },
        { status: 400 }
      );
    }

    // 기존 일정 데이터 가져오기
    let schedules: ScheduleItem[] = [];
    if (course.schedule) {
      try {
        schedules = JSON.parse(course.schedule);
      } catch (e) {
        console.error('기존 일정 데이터 파싱 오류:', e);
        // 파싱 오류 시 빈 배열로 초기화
        schedules = [];
      }
    }

    // 새 일정 생성
    const newSchedule: ScheduleItem = {
      id: uuidv4(), // 고유 ID 생성
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      location,
      teachers: Array.isArray(teachers) ? teachers : [],
    };

    // 일정 추가
    schedules.push(newSchedule);

    // 과정 업데이트
    await prisma.course.update({
      where: { id: courseId },
      data: {
        schedule: JSON.stringify(schedules),
      },
    });

    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    console.error('일정 추가 오류:', error);
    return NextResponse.json(
      { error: '일정 추가에 실패했습니다.' },
      { status: 500 }
    );
  }
} 