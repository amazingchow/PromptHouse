'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { TagType } from '@prisma/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';


import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createTag } from '@/lib/actions';
import { CreateTagSchema } from '@/lib/schema';

import type { z } from 'zod';

type CreateTagForm = z.infer<typeof CreateTagSchema>;

interface CreateTagDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function CreateTagDialog({ children, onSuccess }: CreateTagDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateTagForm>({
    resolver: zodResolver(CreateTagSchema),
    defaultValues: {
      name: '',
      type: TagType.PRIVATE,
    },
  });

  const onSubmit = async (values: CreateTagForm) => {
    setIsLoading(true);
    try {
      const result = await createTag(values);
      if (result.success) {
        setOpen(false);
        form.reset();
        onSuccess?.();
      } else {
        // Handle error
        console.error(result.error);
      }
    } catch (error) {
      console.error('创建标签失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新建标签</DialogTitle>
          <DialogDescription>创建一个新的标签来组织你的提示词</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标签名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入标签名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                取消
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? '创建中...' : '创建标签'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
