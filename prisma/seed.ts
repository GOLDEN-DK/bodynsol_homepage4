const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

// 환경 변수 로드
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // 환경 변수에서 관리자 계정 정보 가져오기
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME || "관리자";

  if (!adminEmail || !adminPassword) {
    console.log(
      "환경 변수에 ADMIN_EMAIL 또는 ADMIN_PASSWORD가 설정되지 않았습니다."
    );
    return;
  }

  // 기존 관리자 계정이 있는지 확인
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("관리자 계정이 이미 존재합니다.");
    // 비밀번호 업데이트
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.update({
      where: { email: adminEmail },
      data: { password: hashedPassword },
    });
    console.log("관리자 계정 비밀번호가 업데이트되었습니다.");
  } else {
    // 새 관리자 계정 생성
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
        role: "admin",
      },
    });
    console.log("관리자 계정이 생성되었습니다.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
