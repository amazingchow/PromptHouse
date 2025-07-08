import { NextResponse} from "next/server";

import prisma from "@/lib/prisma";

import type { NextRequest} from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
    
        const skip = (page - 1) * limit;
    
        const prompts = await prisma.prompt.findMany({
            orderBy: {
                id: "desc",
            },
            skip,
            take: limit,
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });
    
        // 检查是否还有更多数据
        const totalCount = await prisma.prompt.count();
        const hasMore = skip + prompts.length < totalCount;
    
        return NextResponse.json({
            prompts,
            hasMore,
            totalCount,
            currentPage: page,
        });
    } catch (error) {
        console.error("Error fetching prompts:", error);
        return NextResponse.json(
            { error: "Failed to fetch prompts" },
            { status: 500 }
        );
    }
}
