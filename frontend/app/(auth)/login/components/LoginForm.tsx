'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function LoginForm() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password) {
            setError('Username dan password wajib diisi!');
            return;
        }

        try {
            setLoading(true);
            await authService.login({
                username: username.trim(),
                password,
            });

            // Redirect ke halaman utama
            router.push('/');
            router.refresh();
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Login gagal, periksa username dan password Anda!';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                </label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Masukkan username"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Masukkan password"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="block text-center w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-md transition-colors"
                >
                    {loading ? 'Memproses...' : 'Login'}
                </button>
            </div>

            <div className="text-center text-sm text-gray-600">
                Belum punya akun?{' '}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">
                    Daftar sekarang
                </Link>
            </div>
        </form>
    );
}