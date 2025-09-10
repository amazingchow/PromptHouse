import { TagType } from '@prisma/client';
import { z } from 'zod';

export const NewPromptSchema = z.object({
    title: z.string().min(3, { message: '标题至少需要3个字符' }),
    content: z.string().min(10, { message: '提示词内容至少需要10个字符' }),
    description: z.string().optional(),
    version: z.string().regex(/^\d+\.\d+\.\d+$/, { message: '版本号格式不正确, 例如: 1.0.0' }).optional().default('1.0.0'),
    tags: z.array(z.string()),
    isPublic: z.boolean().default(true)
});

export const CreateTagSchema = z.object({
    name: z.string().min(1, { message: '标签名称不能为空' }).max(50, { message: '标签名称不能超过50个字符' }),
    type: z.nativeEnum(TagType),
});
