import Link from 'next/link';

import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <AuthForm mode="login" />
            <p className="mt-4 text-sm text-gray-600">
            还没有账号？
                <Link href="/auth/register" className="text-blue-600 hover:underline">
                立即注册
                </Link>
            </p>
        </div>
    );
}
