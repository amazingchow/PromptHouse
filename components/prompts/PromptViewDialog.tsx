'use client';

import { useState } from 'react';
import type { Tag } from '@prisma/client';
import { Check, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

// 定义包含关联数据的类型
interface PromptWithTags {
  id: string;
  title: string;
  description: string | null;
  content: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  tags: { tag: Tag }[];
}

interface PromptViewDialogProps {
  prompt: PromptWithTags;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PromptViewDialog({ prompt, open, onOpenChange }: PromptViewDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl">{prompt.title}</DialogTitle>
            <Badge variant="outline">{prompt.version}</Badge>
          </div>
          {prompt.description && (
            <div className="text-muted-foreground mt-2">
              <div className="prose dark:prose-invert prose-sm max-w-none [&_ol]:list-decimal [&_p]:whitespace-pre-wrap [&_ul]:list-disc [&>p:first-child]:mt-0">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="whitespace-pre-wrap">{children}</p>,
                    ol: ({ children }) => <ol className="list-decimal pl-4">{children}</ol>,
                    ul: ({ children }) => <ul className="list-disc pl-4">{children}</ul>,
                  }}
                >
                  {prompt.description}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          {/* 标签部分 */}
          <div>
            <h4 className="mb-2 text-sm font-medium">标签</h4>
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map(({ tag }) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* 提示词内容 */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-medium">提示词内容</h4>
              <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 px-2">
                {copied ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-4 w-4" />
                    复制
                  </>
                )}
              </Button>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">{prompt.content}</pre>
            </div>
          </div>

          <Separator />

          {/* 元数据 */}
          <div className="text-muted-foreground grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-end">
              <span className="font-medium">创建时间: </span>
              <span className="ml-1">{new Date(prompt.createdAt).toLocaleString('zh-CN')}</span>
            </div>
            <div className="flex justify-end">
              <span className="font-medium">更新时间: </span>
              <span className="ml-1">{new Date(prompt.updatedAt).toLocaleString('zh-CN')}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
