import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
  { params }: { params: { id: string; scheduleId: string } }
) {
  try {
    const paramsValues = await params;
    const { id: courseId, scheduleId } = paramsValues;

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
      } catch (e) {
        console.error('일정 데이터 파싱 오류:', e);
      }
    }

    // 특정 일정 찾기
    const schedule = schedules.find(s => s.id === scheduleId);

    if (!schedule) {
      return NextResponse.json(
        { error: '일정을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('일정 조회 오류:', error);
    return NextResponse.json(
      { error: '일정을 조회하는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; scheduleId: string } }
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
    const { id: courseId, scheduleId } = paramsValues;

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
      } catch (e) {
        console.error('일정 데이터 파싱 오류:', e);
        return NextResponse.json(
          { error: '일정 데이터가 유효하지 않습니다.' },
          { status: 500 }
        );
      }
    }

    // 특정 일정 찾기
    const scheduleIndex = schedules.findIndex(s => s.id === scheduleId);

    if (scheduleIndex === -1) {
      return NextResponse.json(
        { error: '일정을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { startDate, endDate, location, teachers } = body;

    // 업데이트할 데이터 준비
    const updatedSchedule = { ...schedules[scheduleIndex] };
    if (startDate) updatedSchedule.startDate = new Date(startDate).toISOString();
    if (endDate) updatedSchedule.endDate = new Date(endDate).toISOString();
    if (location) updatedSchedule.location = location;
    if (teachers && Array.isArray(teachers)) updatedSchedule.teachers = teachers;

    // 일정 업데이트
    schedules[scheduleIndex] = updatedSchedule;

    // 과정 업데이트
    await prisma.course.update({
      where: { id: courseId },
      data: {
        schedule: JSON.stringify(schedules),
      },
    });

    return NextResponse.json(updatedSchedule);
  } catch (error) {
    console.error('일정 수정 오류:', error);
    return NextResponse.json(
      { error: '일정 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; scheduleId: string } }
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
    const { id: courseId, scheduleId } = paramsValues;

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
      } catch (e) {
        console.error('일정 데이터 파싱 오류:', e);
        return NextResponse.json(
          { error: '일정 데이터가 유효하지 않습니다.' },
          { status: 500 }
        );
      }
    }

    // 특정 일정 찾기
    const scheduleIndex = schedules.findIndex(s => s.id === scheduleId);

    if (scheduleIndex === -1) {
      return NextResponse.json(
        { error: '일정을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 일정 삭제
    schedules.splice(scheduleIndex, 1);

    // 과정 업데이트
    await prisma.course.update({
      where: { id: courseId },
      data: {
        schedule: JSON.stringify(schedules),
      },
    });

    return NextResponse.json(
      { message: '일정이 성공적으로 삭제되었습니다.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('일정 삭제 오류:', error);
    return NextResponse.json(
      { error: '일정 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 