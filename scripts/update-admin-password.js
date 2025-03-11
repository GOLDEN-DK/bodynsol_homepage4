const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    // 관리자 계정 정보
    const email = 'admin@bodynsol.co.kr';
    const newPassword = 'bodynsol1225!';
    
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // 계정 존재 여부 확인
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!existingUser) {
      console.log('해당 이메일로 등록된 계정이 없습니다.');
      return;
    }
    
    // 비밀번호 업데이트
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log('관리자 계정 비밀번호가 성공적으로 업데이트되었습니다:');
    console.log(`이메일: ${email}`);
    console.log(`새 비밀번호: ${newPassword}`);
  } catch (error) {
    console.error('관리자 계정 비밀번호 업데이트 중 오류가 발생했습니다:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 