'use client';

import { BarChart, FilePlus, LogOut, Tag, User } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Header() {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex h-14 items-center px-4 lg:px-64">
        <div className="logo-box mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-2xl font-bold">PromptHouse</span>
          </Link>
        </div>
        <div className="nav-box flex flex-1 items-center justify-end space-x-4">
          <nav className="text-muted-foreground flex items-center space-x-4 text-sm font-medium">
            <Link href="/" className="hover:text-foreground flex items-center transition-colors">
              <BarChart className="mr-1 h-4 w-4" />
              列表
            </Link>
            <Link href="/prompts/new" className="hover:text-foreground flex items-center transition-colors">
              <FilePlus className="mr-1 h-4 w-4" />
              新建
            </Link>
            <Link href="/manage/tags" className="hover:text-foreground flex items-center transition-colors">
              <Tag className="mr-1 h-4 w-4" />
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
                  className="bg-muted hover:bg-muted/80 flex h-8 w-8 items-center justify-center rounded-full"
                >
                  <User className="text-muted-foreground h-5 w-5" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white py-1 shadow-lg">
                    <div className="border-b px-4 py-2 text-sm text-gray-700">
                      {session.user.name || session.user.email}
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      退出登录
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/auth/login"
                className="bg-muted hover:bg-muted/80 flex h-8 w-8 items-center justify-center rounded-full"
              >
                <User className="text-muted-foreground h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
