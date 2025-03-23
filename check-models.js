const { PrismaClient } = require('@prisma/client'); const client = new PrismaClient(); console.log('Available models:', Object.keys(client)); client.$disconnect();
