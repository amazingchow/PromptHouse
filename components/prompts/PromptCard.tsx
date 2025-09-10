import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

import { PromptDeleteDialog } from "@/components/prompts/PromptDeleteDialog";
import { PromptEditDialog } from "@/components/prompts/PromptEditDialog";
import { PromptViewDialog } from "@/components/prompts/PromptViewDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";


import type { Prisma } from "@prisma/client";

// 定义包含关联数据的类型
type PromptWithTags = Prisma.PromptGetPayload<{
  include: { tags: { include: { tag: true } } };
}>;

interface PromptCardProps {
  prompt: PromptWithTags;
  availableTags?: { id: string; name: string }[];
  onRefresh?: () => void;
}

export function PromptCard({ prompt, availableTags = [], onRefresh }: PromptCardProps) {
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    return (
        <>
            <Card className="flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                        <CardTitle className="text-lg">{prompt.title}</CardTitle>
                        <Badge variant="outline">{prompt.version}</Badge>
                    </div>
                    <CardDescription className="pt-2 line-clamp-2">
                        {prompt.description || "暂无描述"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2">
                        {prompt.tags.map(({ tag }) => (
                            <Badge key={tag.id} variant="secondary">
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end items-center">
                    <div className="flex gap-1">
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setIsViewDialogOpen(true)}
                        >
                            <Eye className="w-3 h-3" />
                            查看
                        </Button>
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setIsEditDialogOpen(true)}
                        >
                            <Pencil className="w-3 h-3" />
                            编辑
                        </Button>
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setIsDeleteDialogOpen(true)}
                            // className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            <Trash2 className="w-3 h-3" />
                            删除
                        </Button>
                    </div>
                </CardFooter>
            </Card>
            
            <PromptViewDialog 
                prompt={prompt}
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
            />
            
            <PromptEditDialog 
                prompt={prompt}
                availableTags={availableTags}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onSuccess={onRefresh}
            />
            
            <PromptDeleteDialog 
                prompt={prompt}
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onSuccess={onRefresh}
            />
        </>
    );
}