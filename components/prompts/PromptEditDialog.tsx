'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';


import { TagMultiSelect } from '@/components/shared/TagMultiSelect';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updatePrompt } from '@/lib/actions';
import { NewPromptSchema } from '@/lib/schema';

import type { Prisma } from '@prisma/client';
import type { z } from 'zod';

// 定义包含关联数据的类型
type PromptWithTags = Prisma.PromptGetPayload<{
  include: { tags: { include: { tag: true } } };
}>;

type NewPromptFormValues = z.input<typeof NewPromptSchema>;

interface PromptEditDialogProps {
  prompt: PromptWithTags;
  availableTags: { id: string; name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PromptEditDialog({ prompt, availableTags, open, onOpenChange, onSuccess }: PromptEditDialogProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<NewPromptFormValues>({
    resolver: zodResolver(NewPromptSchema),
    defaultValues: {
      title: prompt.title,
      content: prompt.content,
      description: prompt.description || '',
      tags: prompt.tags.map(({ tag }) => tag.id),
      version: prompt.version,
    },
  });

  function onSubmit(data: NewPromptFormValues) {
    startTransition(async () => {
      const result = await updatePrompt(prompt.id, data);
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
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>编辑提示词</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    标题 <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="为你的提示词起个醒目的标题" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    提示词内容 <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="在这里输入你的提示词内容，可以包含具体的指令、上下文要求等"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <div className="text-muted-foreground flex items-center pt-2 text-xs">
                    <Info className="mr-1 h-3 w-3" />
                    <span>提示：使用 {'{{变量名}}'} 语法可以创建动态变量</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea placeholder="简要描述这个提示词的用途和使用场景" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标签</FormLabel>
                  <FormControl>
                    <TagMultiSelect availableTags={availableTags} value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>版本</FormLabel>
                  <FormControl>
                    <Input placeholder="建议使用语义化版本号，例如: 1.0.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                取消
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? '更新中...' : '更新'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
