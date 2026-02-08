import { PrismaClient, TagType } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 创建或获取系统用户作为公共标签的创建者
  const hashedPassword = await hash('not_used', 12);
  const systemUser = await prisma.user.upsert({
    where: { email: 'system@prompthouse.ai' },
    update: {},
    create: {
      email: 'system@prompthouse.ai',
      name: 'System',
      password: hashedPassword, // 在实际应用中应该使用加密的密码
    },
  });

  const publicTags = ['OpenAI', 'Claude', 'Gemini', 'Text', 'Vision', 'Multimodal'];

  // 创建标签
  for (const tagName of publicTags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: {
        name: tagName,
        type: TagType.PUBLIC,
        creatorId: systemUser.id,
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
