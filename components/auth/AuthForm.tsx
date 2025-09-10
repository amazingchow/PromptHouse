"use client";

import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export default function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const name = formData.get('name') as string;

        try {
            if (mode === 'register') {
                // 注册
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, name }),
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || '注册失败');
                }

                // 注册成功后自动登录
                const result = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.error) {
                    throw new Error(result.error);
                }

                // 确保登录成功
                if (result?.ok) {
                    // 使用 replace 而不是 push，这样用户不能回到登录页
                    await router.replace('/');
                    // 强制刷新页面以确保session状态更新
                    router.refresh();
                } else {
                    throw new Error('登录失败，请重试');
                }
            } else {
                // 登录
                const result = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                });

                if (result?.error) {
                    throw new Error(result.error);
                }

                // 确保登录成功
                if (result?.ok) {
                    // 使用 replace 而不是 push，这样用户不能回到登录页
                    await router.replace('/');
                    // 强制刷新页面以确保session状态更新
                    router.refresh();
                } else {
                    throw new Error('登录失败，请重试');
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '操作失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">
                {mode === 'login' ? '登录' : '注册'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        昵称
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholder="请输入昵称"
                        />
                    </div>
                )}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    邮箱
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="请输入邮箱"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    密码
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        placeholder="请输入密码"
                    />
                </div>
                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
                </button>
            </form>
        </div>
    );
}
