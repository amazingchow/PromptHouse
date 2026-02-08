'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deletePrompt } from '@/lib/actions';

import type { Prisma } from '@prisma/client';

// 定义包含关联数据的类型
type PromptWithTags = Prisma.PromptGetPayload<{
  include: { tags: { include: { tag: true } } };
}>;

interface PromptDeleteDialogProps {
  prompt: PromptWithTags;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PromptDeleteDialog({ prompt, open, onOpenChange, onSuccess }: PromptDeleteDialogProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deletePrompt(prompt.id);
      if (result.success) {
        onSuccess?.();
        onOpenChange(false);
        // Add a toast notification here in a real app
      } else {
        // Handle error, maybe show a toast
        console.error(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-destructive/10 flex h-10 w-10 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive h-5 w-5" />
            </div>
            <div>
              <DialogTitle>删除提示词</DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">此操作无法撤销</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-muted-foreground mb-3 text-sm">
            您确定要删除提示词 <span className="text-foreground font-medium">&quot;{prompt.title}&quot;</span> 吗？
          </p>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-muted-foreground mb-1 text-xs">提示词内容预览：</p>
            <p className="line-clamp-3 text-sm">
              {prompt.content.substring(0, 100)}
              {prompt.content.length > 100 && '...'}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            取消
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending} className="gap-2">
            <Trash2 className="h-4 w-4" />
            {isPending ? '删除中...' : '删除'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
