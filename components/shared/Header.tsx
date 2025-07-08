import { BarChart, FilePlus, Folder, Languages, User } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4 lg:px-32">
                <div className="mr-4 flex items-center logo-box">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold text-2xl">PromptHouse</span>
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4 nav-box">
                    <nav className="flex items-center space-x-4 text-sm font-medium text-muted-foreground">
                        <Link href="/" className="transition-colors hover:text-foreground flex items-center">
                            <BarChart className="h-4 w-4 mr-1" /> 列表
                        </Link>
                        <Link href="/prompts/new" className="transition-colors hover:text-foreground flex items-center">
                            <FilePlus className="h-4 w-4 mr-1" /> 新建
                        </Link>
                        {/* <Link href="#" className="transition-colors hover:text-foreground flex items-center">
                            <Languages className="h-4 w-4 mr-1" />
                        </Link> */}
                    </nav>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
            </div>
        </header>
    );
}