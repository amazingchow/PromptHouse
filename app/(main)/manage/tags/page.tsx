import { TagType } from '@prisma/client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { CreateTagDialog } from '@/components/forms/CreateTagDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';

async function getTags() {
    const allTags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });
    const publicTags = allTags.filter(t => t.type === TagType.PUBLIC);
    const privateTags = allTags.filter(t => t.type === TagType.PRIVATE);
    return { publicTags, privateTags };
}

export default async function TagManagementPage() {
    const { publicTags, privateTags } = await getTags();

    return (
        <div className="container py-8 max-w-4xl mx-auto">
            <Link href="/" className="text-sm text-muted-foreground flex items-center mb-4 hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-1" />
        返回提示词库
            </Link>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">标签库</h1>
                <CreateTagDialog>
                    <Button>新建标签</Button>
                </CreateTagDialog>
            </div>

            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>公共标签</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {publicTags.map(tag => (
                            <Badge key={tag.id} variant="secondary" className="px-3 py-1 text-sm">{tag.name}</Badge>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>私有标签</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {privateTags.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">暂无私有标签</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {privateTags.map(tag => (
                                    <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}