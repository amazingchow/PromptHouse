'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { createPrompt } from '@/lib/actions';
import { NewPromptSchema } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TagMultiSelect } from '@/components/shared/TagMultiSelect';

type NewPromptFormValues = z.input<typeof NewPromptSchema>;

interface NewPromptFormProps {
  availableTags: { id: string; name: string }[];
}

export function NewPromptForm({ availableTags }: NewPromptFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<NewPromptFormValues>({
    resolver: zodResolver(NewPromptSchema),
    defaultValues: {
      title: '',
      content: '',
      description: '',
      tags: [],
      version: '1.0.0',
    },
  });

  function onSubmit(data: NewPromptFormValues) {
    startTransition(async () => {
      const result = await createPrompt(data);
      if (result.success) {
        // Add a toast notification here in a real app
        router.push('/');
      } else {
        // Handle error, maybe show a toast
        console.error(result.error);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? '创建中...' : '创建'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            取消
          </Button>
        </div>
      </form>
    </Form>
  );
}
