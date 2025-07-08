import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const tags = await prisma.tag.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' },
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
