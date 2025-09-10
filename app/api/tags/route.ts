import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import prisma from "@/lib/prisma";

import type { Prisma } from "@prisma/client";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "100");
        const skip = (page - 1) * limit;

        // 获取当前用户
        const token = await getToken({ req: request });
        const userId = token?.sub;

        // 构建查询条件：公开标签或用户自己创建的私有标签
        const where: Prisma.TagWhereInput = {
            OR: [
                { type: "PUBLIC" },
                userId ? { creatorId: userId } : { id: "none" },
            ],
        };

        const tags = await prisma.tag.findMany({
            where,
            orderBy: {
                id: "desc",
            },
            skip,
            take: limit,
            select: { 
                id: true, 
                name: true,
                type: true,
                creator: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json(tags);
    } catch (error) {
        console.error("Error fetching tags:", error);
        return NextResponse.json(
            { error: "Failed to fetch tags" },
            { status: 500 }
        );
    }
}
