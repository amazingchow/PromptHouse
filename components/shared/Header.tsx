'use client';

import { BarChart, FilePlus, LogOut, User, Tag } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Header() {
    const { data: session } = useSession();
    const [showUserMenu, setShowUserMenu] = useState(false);
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4 lg:px-64">
                <div className="mr-4 flex items-center logo-box">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold text-2xl">PromptHouse</span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4 nav-box">
                    <nav className="flex items-center space-x-4 text-sm font-medium text-muted-foreground">
                        <Link href="/" className="transition-colors hover:text-foreground flex items-center">
                            <BarChart className="h-4 w-4 mr-1" />
                            列表
                        </Link>
                        <Link href="/prompts/new" className="transition-colors hover:text-foreground flex items-center">
                            <FilePlus className="h-4 w-4 mr-1" />
                            新建
                        </Link>
                        <Link href="/manage/tags" className="transition-colors hover:text-foreground flex items-center">
                            <Tag className="w-4 h-4 mr-1" />
                            标签
                        </Link>
                        {/* <Link href="#" className="transition-colors hover:text-foreground flex items-center">
                            <Languages className="h-4 w-4 mr-1" />
                        </Link> */}
                    </nav>
                    <div className="relative">
                        {session ? (
                            <>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                                >
                                    <User className="h-5 w-5 text-muted-foreground" />
                                </button>
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                            {session.user.name || session.user.email}
                                        </div>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            退出登录
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                            >
                                <User className="h-5 w-5 text-muted-foreground" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}