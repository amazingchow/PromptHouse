import { NewPromptForm } from '@/components/forms/NewPromptForm';
import prisma from '@/lib/prisma';

export default async function NewPromptPage() {
  const tags = await prisma.tag.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="mb-6 text-3xl font-bold">创建提示词</h1>
      <NewPromptForm availableTags={tags} />
    </div>
  );
}
