import { NextResponse, type NextRequest } from 'next/server';
import type { Prisma } from '@prisma/client';
import { getToken } from 'next-auth/jwt';

import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    const search = searchParams.get('search') || '';

    // 获取当前用户
    const token = await getToken({ req: request });
    const userId = token?.sub;

    // 构建查询条件
    const where: Prisma.PromptWhereInput = {
      AND: [
        // 搜索条件
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        // 访问控制：公开的提示词或当前用户的私有提示词
        {
          OR: [{ isPublic: true }, userId ? { creatorId: userId } : { id: 'none' }],
        },
      ],
    };

    const prompts = await prisma.prompt.findMany({
      where,
      orderBy: {
        id: 'desc',
      },
      skip,
      take: limit,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // 检查是否还有更多数据
    const totalCount = await prisma.prompt.count({ where });
    const hasMore = skip + prompts.length < totalCount;

    return NextResponse.json({
      prompts,
      hasMore,
      totalCount,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 });
  }
}
