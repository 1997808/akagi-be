// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two dummy articles
  const user1 = await prisma.user.create({
    data: {
      email: 'test@gmail.com',
      username: 'Tester1',
      password: '123',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'test2@gmail.com',
      username: 'Tester2',
      password: '123',
    },
  });

  console.log({ user1, user2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
