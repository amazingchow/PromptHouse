import { NewPromptForm } from '@/components/forms/NewPromptForm';
import prisma from '@/lib/prisma';

export default async function NewPromptPage() {
    const tags = await prisma.tag.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
    });

    return (
        <div className="container py-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">创建提示词</h1>
            <NewPromptForm availableTags={tags} />
        </div>
    );
}