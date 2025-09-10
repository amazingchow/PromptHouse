"use client";

import { PlusCircle, Tag, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";

import { PromptMasonry } from "@/components/prompts/PromptMasonry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Prisma } from "@prisma/client";

// 定义包含关联数据的类型
type PromptWithTags = Prisma.PromptGetPayload<{
  include: { tags: { include: { tag: true } } };
}>;

interface ApiResponse {
  prompts: PromptWithTags[];
  hasMore: boolean;
  totalCount: number;
  currentPage: number;
}

export default function HomePage() {
    const [prompts, setPrompts] = useState<PromptWithTags[]>([]);
    const [availableTags, setAvailableTags] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [inputValue, setInputValue] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const isSearching = useRef(false);

    // 获取提示词数据
    const fetchPrompts = useCallback(async (page: number, search: string = "", isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const searchQuery = search ? `&search=${encodeURIComponent(search)}` : "";
            const response = await fetch(`/api/prompts?page=${page}&limit=20${searchQuery}`);
            if (!response.ok) {
                throw new Error("Failed to fetch prompts");
            }

            const data: ApiResponse = await response.json();

            if (isLoadMore) {
                setPrompts(prev => {
                    // 使用 Map 来去重，确保不会有重复的 prompt
                    const promptMap = new Map();
                    
                    // 先添加现有的 prompts
                    prev.forEach(prompt => {
                        promptMap.set(prompt.id, prompt);
                    });
                    
                    // 再添加新的 prompts（如果有重复的 ID，新的会覆盖旧的）
                    data.prompts.forEach(prompt => {
                        promptMap.set(prompt.id, prompt);
                    });
                    
                    return Array.from(promptMap.values());
                });
            } else {
                setPrompts(data.prompts);
            }

            setHasMore(data.hasMore);
            setCurrentPage(data.currentPage);
        } catch (error) {
            console.error("Error fetching prompts:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // 获取标签数据
    const fetchTags = useCallback(async () => {
        try {
            const response = await fetch('/api/tags');
            if (!response.ok) {
                throw new Error("Failed to fetch tags");
            }
            const tags = await response.json();
            setAvailableTags(tags);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    }, []);

    // 初始加载
    useEffect(() => {
        fetchPrompts(1, "");
        fetchTags();
    }, [fetchPrompts, fetchTags]);

    // 滚动监听
    useEffect(() => {
        const handleScroll = () => {
            if (loadingMore || !hasMore) return;

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // 当滚动到距离底部100px时开始加载更多
            if (scrollTop + windowHeight >= documentHeight - 100) {
                fetchPrompts(currentPage + 1, searchTerm, true);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loadingMore, hasMore, currentPage, fetchPrompts, searchTerm]);

    if (loading) {
        return (
            <div className="container py-8 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">提示词库</h1>
                </div>
                <div className="flex justify-center items-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="ml-2 text-muted-foreground">加载中...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">提示词库</h1>
                    <div className="relative w-2/5">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="搜索提示词..."
                            value={inputValue}
                            className="pl-10"
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (!isSearching.current) {
                                        isSearching.current = true;
                                        setSearchTerm(inputValue);
                                        setCurrentPage(1);
                                        fetchPrompts(1, inputValue).finally(() => {
                                            isSearching.current = false;
                                        });
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {prompts.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h2 className="text-xl font-semibold text-muted-foreground">暂无提示词</h2>
                    <p className="text-muted-foreground mt-2 mb-4">开始创建你的第一个提示词资产吧！</p>
                    <Button asChild>
                        <Link href="/prompts/new">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            立即创建
                        </Link>
                    </Button>
                </div>
            ) : (
                <>
                    <PromptMasonry 
                        prompts={prompts} 
                        columns={3} 
                        availableTags={availableTags} 
                        onRefresh={() => fetchPrompts(1)}
                    />

                    {/* 加载更多状态 */}
                    {loadingMore && (
                        <div className="flex justify-center items-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span className="ml-2 text-muted-foreground">加载更多...</span>
                        </div>
                    )}

                    {/* 没有更多数据提示 */}
                    {!hasMore && prompts.length > 0 && (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">没有更多的提示词了！</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
