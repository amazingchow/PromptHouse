'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
            <h1 className="text-4xl font-bold">500</h1>
            <p className="text-xl text-muted-foreground">服务器出错了</p>
            <button
                onClick={reset}
                className="text-primary hover:underline"
            >
                重试
            </button>
        </div>
    );
}
