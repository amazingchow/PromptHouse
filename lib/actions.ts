'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { CreateTagSchema, NewPromptSchema } from '@/lib/schema';

export async function createPrompt(values: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: '请先登录!' };
  }

  const validatedFields = NewPromptSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: '输入数据无效!' };
  }

  const { title, content, description, version, tags, isPublic = true } = validatedFields.data;

  try {
    await prisma.prompt.create({
      data: {
        title,
        content,
        description,
        version,
        isPublic,
        creatorId: session.user.id,
        tags: {
          create: tags.map((tagId) => ({
            tag: {
              connect: { id: tagId },
            },
            assigner: {
              connect: { id: session.user.id },
            },
          })),
        },
      },
    });

    revalidatePath('/manage/tags'); // Or wherever prompts are listed
    return { success: '提示词创建成功!' };
  } catch (error) {
    console.error(error);
    return { error: '提示词创建失败，请稍后重试。' };
  }
}

export async function updatePrompt(id: string, values: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: '请先登录!' };
  }

  // 检查是否有权限修改
  const prompt = await prisma.prompt.findUnique({
    where: { id },
    select: { creatorId: true },
  });

  if (!prompt || prompt.creatorId !== session.user.id) {
    return { error: '没有权限修改此提示词!' };
  }

  const validatedFields = NewPromptSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: '输入数据无效!' };
  }

  const { title, content, description, version, tags, isPublic = true } = validatedFields.data;

  try {
    // 先删除现有的标签关联
    await prisma.promptTag.deleteMany({
      where: { promptId: id },
    });

    // 更新提示词并重新创建标签关联
    await prisma.prompt.update({
      where: { id },
      data: {
        title,
        content,
        description,
        version,
        isPublic,
        tags: {
          create: tags.map((tagId) => ({
            tag: {
              connect: { id: tagId },
            },
            assigner: {
              connect: { id: session.user.id },
            },
          })),
        },
      },
    });

    revalidatePath('/');
    return { success: '提示词更新成功!' };
  } catch (error) {
    console.error(error);
    return { error: '提示词更新失败，请稍后重试。' };
  }
}

export async function deletePrompt(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: '请先登录!' };
  }

  // 检查是否有权限删除
  const prompt = await prisma.prompt.findUnique({
    where: { id },
    select: { creatorId: true },
  });

  if (!prompt || prompt.creatorId !== session.user.id) {
    return { error: '没有权限删除此提示词!' };
  }

  try {
    // 先删除相关的标签关联
    await prisma.promptTag.deleteMany({
      where: { promptId: id },
    });

    // 删除提示词
    await prisma.prompt.delete({
      where: { id },
    });

    revalidatePath('/');
    return { success: '提示词删除成功!' };
  } catch (error) {
    console.error(error);
    return { error: '提示词删除失败，请稍后重试。' };
  }
}

export async function createTag(values: unknown) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: '请先登录!' };
  }

  const validatedFields = CreateTagSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: '输入数据无效!' };
  }

  try {
    const { name, type } = validatedFields.data;

    await prisma.tag.create({
      data: {
        name,
        type,
        creatorId: session.user.id,
      },
    });

    revalidatePath('/manage/tags');
    return { success: '标签创建成功!' };
  } catch (error) {
    console.error(error);
    return { error: '标签创建失败，请稍后重试。' };
  }
}
