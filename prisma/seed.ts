const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // 기존 관리자 계정이 있는지 확인
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@bodynsol.co.kr" },
  });

  if (existingAdmin) {
    console.log("관리자 계정이 이미 존재합니다.");
    // 비밀번호 업데이트
    const hashedPassword = await bcrypt.hash("bodynsol1225!", 10);
    await prisma.user.update({
      where: { email: "admin@bodynsol.co.kr" },
      data: { password: hashedPassword },
    });
    console.log("관리자 계정 비밀번호가 업데이트되었습니다.");
  } else {
    // 새 관리자 계정 생성
    const hashedPassword = await bcrypt.hash("bodynsol1225!", 10);
    await prisma.user.create({
      data: {
        email: "admin@bodynsol.co.kr",
        name: "관리자",
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
