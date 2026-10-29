'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function RegisterForm() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!username.trim() || !email.trim() || !password) {
            setError('Semua bidang wajib diisi!');
            return;
        }

        if (!email.includes('@')) {
            setError('Format email tidak valid!');
            return;
        }

        if (password !== confirmPassword) {
            setError('Password dan konfirmasi password tidak cocok!');
            return;
        }

        try {
            setLoading(true);
            await authService.register({
                username: username.trim(),
                email: email.trim(),
                password,
            });

            setSuccess('Registrasi berhasil! Mengalihkan ke halaman login...');
            setTimeout(() => {
                router.push('/login');
            }, 1500);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Gagal registrasi akun, coba username atau email lain!';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-200 rounded-md">
                    {success}
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
                    Email
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Masukkan email"
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

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Password
                </label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Masukkan ulang password"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="block text-center w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-md transition-colors"
                >
                    {loading ? 'Mendaftarkan...' : 'Register'}
                </button>
            </div>

            <div className="text-center text-sm text-gray-600">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Login
                </Link>
            </div>
        </form>
    );
}