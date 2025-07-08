"use client";

import { PromptCard } from "@/components/prompts/PromptCard";

import type { Prisma } from "@prisma/client";

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

export function PromptMasonry({ 
    prompts, 
    columns = 3,
    availableTags = [],
    onRefresh
}: PromptMasonryProps) {
    if (prompts.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h2 className="text-xl font-semibold text-muted-foreground">暂无提示词</h2>
                <p className="text-muted-foreground mt-2">无法显示瀑布流</p>
            </div>
        );
    }
    console.log(prompts);
    return (
        <div className="flex justify-center">
            <div 
                className="grid gap-6 auto-rows-max"
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
