"use client";

import Link from "next/link";
import React, { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const router = useRouter();

    const handleRegister = (e: FormEvent) => {
        e.preventDefault();
        // Simulasi register sukses & otomatis login
        document.cookie = "isLoggedIn=true; path=/";
        router.push("/");
        router.refresh();
    };

    return (
        <form onSubmit={handleRegister} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                </label>
                <input
                    type="text"
                    name="name"
                    required
                    placeholder="Masukkan nama"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
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
                    id="password"
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
                    id="confirmPassword"
                    required
                    placeholder="Masukkan ulang password"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
            </div>

            <div className="pt-2">
                <button type="submit" className="block text-center w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
                    Register
                </button>
            </div>

            <div className="text-center text-sm text-gray-600">
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Login
                </Link>
            </div>
        </form>
    );
}