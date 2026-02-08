'use client';

import type { Prisma } from '@prisma/client';

import { PromptCard } from '@/components/prompts/PromptCard';

// 定义包含关联数据的类型
type PromptWithTags = Prisma.PromptGetPayload<{
  include: { tags: { include: { tag: true } } };
}>;

interface PromptMasonryProps {
  prompts: PromptWithTags[];
  columns?: number;
  availableTags?: { id: string; name: string }[];
  onRefresh?: () => void;
}

export function PromptMasonry({ prompts, columns = 3, availableTags = [], onRefresh }: PromptMasonryProps) {
  if (prompts.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed py-16 text-center">
        <h2 className="text-muted-foreground text-xl font-semibold">暂无提示词</h2>
        <p className="text-muted-foreground mt-2">无法显示瀑布流</p>
      </div>
    );
  }
  console.log(prompts);
  return (
    <div className="flex justify-center">
      <div
        className="grid auto-rows-max gap-6"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {prompts.map((prompt, index) => (
          <div key={`${prompt.id}-${index}`} className="break-inside-avoid">
            <PromptCard prompt={prompt} availableTags={availableTags} onRefresh={onRefresh} />
          </div>
        ))}
      </div>
    </div>
  );
}
