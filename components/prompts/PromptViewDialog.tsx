"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import type { Tag } from "@prisma/client";

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
};

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
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto sm:max-w-4xl">
                <DialogHeader>
                    <div className="flex justify-between items-start gap-4">
                        <DialogTitle className="text-xl">{prompt.title}</DialogTitle>
                        <Badge variant="outline">{prompt.version}</Badge>
                    </div>
                    {prompt.description && (
                        <div className="mt-2 text-muted-foreground">
                            <div className="prose dark:prose-invert prose-sm max-w-none [&>p:first-child]:mt-0 [&_p]:whitespace-pre-wrap [&_ol]:list-decimal [&_ul]:list-disc">
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
                        <h4 className="text-sm font-medium mb-2">标签</h4>
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
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium">提示词内容</h4>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCopy}
                                className="h-8 px-2"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-4 w-4 mr-1" />
                                        已复制
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4 mr-1" />
                                        复制
                                    </>
                                )}
                            </Button>
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                            <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                                {prompt.content}
                            </pre>
                        </div>
                    </div>
                    
                    <Separator />
                    
                    {/* 元数据 */}
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
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
