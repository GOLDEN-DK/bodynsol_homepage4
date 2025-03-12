// .env 파일에서 환경 변수 로드
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  try {
    // 이메일과 비밀번호는 명령줄 인수로 받거나 환경 변수에서 가져올 수 있습니다
    const email =
      process.argv[2] || process.env.ADMIN_EMAIL || "admin@bodynsol.co.kr";
    const password = process.argv[3] || process.env.ADMIN_PASSWORD;

    if (!password) {
      console.error(
        "비밀번호가 제공되지 않았습니다. 명령줄 인수나 ADMIN_PASSWORD 환경 변수를 통해 비밀번호를 제공해주세요."
      );
      process.exit(1);
    }

    // 기존 관리자 계정이 있는지 확인
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingAdmin) {
      // 기존 계정이 있으면 비밀번호 업데이트
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });
      console.log(`관리자 계정(${email})의 비밀번호가 업데이트되었습니다.`);
    } else {
      // 새 관리자 계정 생성
      await prisma.user.create({
        data: {
          email,
          name: "관리자",
          password: hashedPassword,
          role: "admin",
        },
      });
      console.log(`새 관리자 계정(${email})이 생성되었습니다.`);
    }
  } catch (error) {
    console.error("관리자 계정 생성/업데이트 중 오류 발생:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
