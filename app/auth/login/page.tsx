import Link from 'next/link';

import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center">
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
