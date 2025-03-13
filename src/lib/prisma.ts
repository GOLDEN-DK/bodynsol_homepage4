import { PrismaClient } from "@prisma/client";

// PrismaClient 인스턴스 생성
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// 전역 변수 타입 선언
type GlobalWithPrisma = typeof globalThis & {
  prisma?: PrismaClient;
};

// 개발 환경에서는 전역 변수를 사용하여 핫 리로딩 시 여러 인스턴스가 생성되는 것을 방지
const globalForPrisma = global as GlobalWithPrisma;
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
