import Link from 'next/link';

import AuthForm from '@/components/auth/AuthForm';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <AuthForm mode="register" />
            <p className="mt-4 text-sm text-gray-600">
            已有账号？
                <Link href="/auth/login" className="text-blue-600 hover:underline">
                立即登录
                </Link>
            </p>
        </div>
    );
}
