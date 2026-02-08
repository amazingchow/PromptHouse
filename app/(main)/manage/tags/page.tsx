import Link from 'next/link';
import { TagType } from '@prisma/client';
import { ArrowLeft } from 'lucide-react';

import prisma from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateTagDialog } from '@/components/forms/CreateTagDialog';

async function getTags() {
  const allTags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });
  const publicTags = allTags.filter((t) => t.type === TagType.PUBLIC);
  const privateTags = allTags.filter((t) => t.type === TagType.PRIVATE);
  return { publicTags, privateTags };
}

export default async function TagManagementPage() {
  const { publicTags, privateTags } = await getTags();

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Link href="/" className="text-muted-foreground hover:text-foreground mb-4 flex items-center text-sm">
        <ArrowLeft className="mr-1 h-4 w-4" />
        返回提示词库
      </Link>

      <div className="mb-6 flex items-center justify-between">
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
            {publicTags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="px-3 py-1 text-sm">
                {tag.name}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>私有标签</CardTitle>
          </CardHeader>
          <CardContent>
            {privateTags.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center text-sm">暂无私有标签</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {privateTags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
