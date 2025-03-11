import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// 설정 파일 경로
const settingsFilePath = path.join(process.cwd(), 'data', 'settings.json');

// 설정 파일이 없으면 생성
const ensureSettingsFile = () => {
  const dirPath = path.join(process.cwd(), 'data');
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  if (!fs.existsSync(settingsFilePath)) {
    fs.writeFileSync(settingsFilePath, JSON.stringify({
      heroVideo: null
    }), 'utf-8');
  }
};

// 설정 가져오기
const getSettings = () => {
  ensureSettingsFile();
  const data = fs.readFileSync(settingsFilePath, 'utf-8');
  return JSON.parse(data);
};

// 설정 저장하기
const saveSettings = (settings: any) => {
  ensureSettingsFile();
  fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), 'utf-8');
};

// GET 요청 처리 - 히어로 영상 URL 가져오기
export async function GET() {
  try {
    const settings = getSettings();
    
    return NextResponse.json({
      videoUrl: settings.heroVideo
    });
  } catch (error) {
    console.error('히어로 영상 설정을 가져오는데 실패했습니다:', error);
    return NextResponse.json(
      { error: '히어로 영상 설정을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST 요청 처리 - 히어로 영상 URL 설정하기
export async function POST(request: Request) {
  try {
    // 간단한 인증 체크 (실제 프로덕션에서는 더 강력한 인증이 필요합니다)
    // 여기서는 간단히 구현합니다
    
    const { videoUrl } = await request.json();
    
    // 설정 업데이트
    const settings = getSettings();
    settings.heroVideo = videoUrl;
    saveSettings(settings);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('히어로 영상 설정을 업데이트하는데 실패했습니다:', error);
    return NextResponse.json(
      { error: '히어로 영상 설정을 업데이트하는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 