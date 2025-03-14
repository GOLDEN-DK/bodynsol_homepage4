import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // 인증 검사 제거 - 현재는 간단한 구현을 위해 모든 요청 허용

    // multipart/form-data 처리
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const mediaType = (formData.get("type") as string) || "image"; // 'image', 'gif', 'video' 중 하나

    if (!file) {
      return NextResponse.json(
        { error: "파일이 제공되지 않았습니다." },
        { status: 400 }
      );
    }

    // 파일 타입 확인
    const fileType = file.type;
    const isImage = fileType.startsWith("image/");
    const isVideo = fileType.startsWith("video/");
    const isGif = fileType === "image/gif";

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "이미지 또는 비디오 파일만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }

    // 파일 크기 확인 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "파일 크기는 10MB를 초과할 수 없습니다." },
        { status: 400 }
      );
    }

    // 파일 폴더 설정
    let folder;
    if (isVideo) {
      folder = "videos";
    } else if (isGif) {
      folder = "gifs";
    } else {
      folder = "images";
    }

    // 파일을 Base64로 변환
    const fileBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(fileBuffer).toString("base64");
    const fileData = `data:${fileType};base64,${base64Data}`;

    // Cloudinary에 업로드
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: `bodynsol/${folder}`,
        resource_type: isVideo ? ("video" as const) : ("image" as const),
        public_id: uuidv4(),
      };

      cloudinary.uploader.upload(fileData, uploadOptions, (error, result) => {
        if (error) {
          console.error("Cloudinary 업로드 오류:", error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    // 타입 단언
    const result = uploadResult as any;

    // 미디어 타입 결정
    let type;
    if (isVideo) {
      type = "video";
    } else if (isGif) {
      type = "gif";
    } else {
      type = "image";
    }

    // 데이터베이스에 미디어 정보 저장
    const media = await prisma.media.create({
      data: {
        type,
        url: result.secure_url,
        width: result.width || 1920,
        height: result.height || 600,
        size: file.size,
        mimeType: fileType,
        title: (formData.get("title") as string) || null,
        description: (formData.get("description") as string) || null,
      },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error("미디어 업로드 오류:", error);
    return NextResponse.json(
      { error: "파일 업로드 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
