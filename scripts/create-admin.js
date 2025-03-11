const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    // 기본 관리자 계정 정보
    const email = 'admin@bodynsol.co.kr';
    const password = 'bodynsol1225!';
    const name = '관리자';
    
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 이미 존재하는 계정인지 확인
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log('이미 해당 이메일로 등록된 계정이 있습니다.');
      return;
    }
    
    // 관리자 계정 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin'
      }
    });
    
    console.log('관리자 계정이 성공적으로 생성되었습니다:');
    console.log(`이메일: ${email}`);
    console.log(`비밀번호: ${password}`);
    console.log(`이름: ${name}`);
    console.log(`역할: admin`);
  } catch (error) {
    console.error('관리자 계정 생성 중 오류가 발생했습니다:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 