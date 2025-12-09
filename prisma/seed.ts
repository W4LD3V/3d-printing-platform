import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
      name: 'Admin'
    }
  });

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
      name: 'Sample User'
    }
  });

  const plastics = [
    { name: 'PLA Matte', description: 'Fast prototyping', pricePerGram: 0.15 },
    { name: 'PETG Tough', description: 'Functional parts', pricePerGram: 0.22 },
    { name: 'ABS Pro', description: 'Heat resistant', pricePerGram: 0.3 }
  ];
  for (const plastic of plastics) {
    await prisma.plastic.upsert({
      where: { name: plastic.name },
      update: plastic,
      create: plastic
    });
  }

  const colors = [
    { name: 'Carbon Black', hex: '#0b132b' },
    { name: 'Signal Orange', hex: '#f97316' },
    { name: 'Arctic White', hex: '#e2e8f0' }
  ];
  for (const color of colors) {
    await prisma.color.upsert({
      where: { name: color.name },
      update: color,
      create: color
    });
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
