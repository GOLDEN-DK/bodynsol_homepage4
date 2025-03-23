import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary 설정 확인
const checkCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Cloudinary 설정이 누락되었습니다:", {
      cloudName: !!cloudName,
      apiKey: !!apiKey,
      apiSecret: !!apiSecret
    });
    return false;
  }
  
  return true;
};

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 허용되는 파일 형식
const allowedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

// 최대 파일 크기 (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // Cloudinary 설정 확인
    if (!checkCloudinaryConfig()) {
      return NextResponse.json(
        { error: "서버 설정 오류: Cloudinary 자격 증명이 올바르게 구성되지 않았습니다." },
        { status: 500 }
      );
    }

    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 401 }
      );
    }

    // FormData로부터 파일 추출
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "파일이 업로드되지 않았습니다." },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    if (!allowedFormats.includes(file.type)) {
      return NextResponse.json(
        { error: "지원하지 않는 파일 형식입니다. JPG, PNG, WebP, GIF 형식만 허용됩니다." },
        { status: 400 }
      );
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "파일 크기는 5MB 이하여야 합니다." },
        { status: 400 }
      );
    }

    console.log("파일 업로드 시작:", { name: file.name, size: file.size, type: file.type });

    // 파일을 Base64로 변환
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const fileData = `data:${file.type};base64,${base64Data}`;

    // Cloudinary에 업로드
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileData, 
        {
          folder: 'bodynsol/thumbnails',
          public_id: uuidv4(),
          resource_type: 'image'
        }, 
        (error, result) => {
          if (error) {
            console.error("Cloudinary 업로드 오류:", error);
            reject(error);
          } else {
            console.log("Cloudinary 업로드 성공:", result?.public_id);
            resolve(result);
          }
        }
      );
    });

    // 타입 단언
    const result = uploadResult as any;

    return NextResponse.json(
      { 
        url: result.secure_url,
        width: result.width,
        height: result.height 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("파일 업로드 오류:", error);
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json(
      { error: `파일 업로드 중 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    );
  }
}
