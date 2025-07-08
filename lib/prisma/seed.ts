import { PrismaClient, TagType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    const publicTags = [
        'OpenAI', 'Claude', 'Gemini',
        'Text', 'Vision', 'Multimodal',
    ];
    for (const tagName of publicTags) {
        await prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: {
                name: tagName,
                type: TagType.PUBLIC,
            },
        });
    }

    const prompt = 
    {
        title: '小红书爆款笔记生成器',
        content: `
    **Your Optimized Prompt:**
    你是一名小红书爆款笔记专家，深谙小红书平台的用户喜好和内容传播机制。请为我围绕 **[在这里填写你的主题或关键词]** 生成一篇能够迅速吸引关注并获得大量点赞收藏转发的小红书爆款笔记。

    内容需包含：
    1.  一个超级吸引眼球的标题（含2-3个emoji，并运用数字、疑问句或反差词汇）。
    2.  一段引人入胜的正文（分3-5个自然段，每段开头用小标题或加粗重点词，文中可自然穿插2-4个相关emoji，并提供实用价值、真实体验或独特见解）。
    3.  3-5个相关性高且带有流量潜力的热门话题标签（#）。
    4.  一个引导互动、收藏或分享的结尾。

    请以小红书笔记的排版风格呈现。
    `,
        description: '小红书爆款笔记生成器',
        version: '1.0.0',
        tags: ['Gemini', 'Multimodal'],
    };
    for (let i = 0; i < 500; i++) {
        await prisma.prompt.create({
            data: {
                ...prompt,
                tags: {
                    create: prompt.tags.map(tag => ({
                        tag: { connect: { name: tag } },
                    })),
                },
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
