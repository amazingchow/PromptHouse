'use client';

import { useCallback, useEffect, useState } from 'react';

import { PromptCard } from '@/components/prompts/PromptCard';

import type { Prisma } from '@prisma/client';


// 定义包含关联数据的类型
type PromptWithTags = Prisma.PromptGetPayload<{
  include: { tags: { include: { tag: true } } };
}>;

interface PromptCarouselProps {
  prompts: PromptWithTags[];
  autoPlay?: boolean;
  interval?: number;
  availableTags?: { id: string; name: string }[];
  onRefresh?: () => void;
}

export function PromptCarousel({
  prompts,
  autoPlay = true,
  interval = 5000,
  availableTags = [],
  onRefresh,
}: PromptCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 获取当前显示的卡片索引
  const getVisibleCards = () => {
    const total = prompts.length;
    if (total === 0) return [];

    const prev = (currentIndex - 1 + total) % total;
    const next = (currentIndex + 1) % total;

    return [
      { index: prev, position: 'left' },
      { index: currentIndex, position: 'center' },
      { index: next, position: 'right' },
    ];
  };

  // 动画到指定索引
  const animateToIndex = useCallback(
    (targetIndex: number) => {
      if (isAnimating || prompts.length === 0) return;

      setIsAnimating(true);
      setCurrentIndex(targetIndex);

      // 动画完成后重置状态
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    },
    [isAnimating, prompts.length],
  );

  // 下一张
  const next = useCallback(() => {
    const nextIndex = (currentIndex + 1) % prompts.length;
    animateToIndex(nextIndex);
  }, [currentIndex, prompts.length, animateToIndex]);

  // 上一张
  const prev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + prompts.length) % prompts.length;
    animateToIndex(prevIndex);
  }, [currentIndex, prompts.length, animateToIndex]);

  // 自动播放
  useEffect(() => {
    if (!autoPlay || prompts.length <= 1) return;

    const timer = setInterval(() => {
      next();
    }, interval);

    return () => clearInterval(timer);
  }, [next, autoPlay, interval, prompts.length]);

  if (prompts.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed py-16 text-center">
        <h2 className="text-muted-foreground text-xl font-semibold">暂无提示词</h2>
        <p className="text-muted-foreground mt-2">无法显示轮播</p>
      </div>
    );
  }

  const visibleCards = getVisibleCards();

  return (
    <div className="relative w-full">
      {/* 轮播容器 */}
      <div className="relative flex h-96 items-center justify-center overflow-hidden">
        {visibleCards.map(({ index, position }) => (
          <div
            key={`${index}-${position}`}
            className={`absolute transition-all duration-300 ease-in-out ${position === 'center' ? 'z-10' : 'z-1'}`}
            style={{
              transform:
                position === 'left'
                  ? 'translateX(-50%) scale(0.8)'
                  : position === 'right'
                    ? 'translateX(50%) scale(0.8)'
                    : 'translateX(0%) scale(1)',
              opacity: position === 'center' ? 1 : 0.3,
            }}
          >
            <div className="w-80">
              <PromptCard prompt={prompts[index]} availableTags={availableTags} onRefresh={onRefresh} />
            </div>
          </div>
        ))}
      </div>

      {/* 控制按钮 */}
      {prompts.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            disabled={isAnimating}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            上一张
          </button>
          <div className="flex gap-2">
            {prompts.map((_, index) => (
              <button
                key={index}
                onClick={() => animateToIndex(index)}
                disabled={isAnimating}
                className={`h-3 w-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted hover:bg-muted/80'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              />
            ))}
          </div>
          <button
            onClick={next}
            disabled={isAnimating}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            下一张
          </button>
        </div>
      )}
    </div>
  );
}
