"use client";

import Link from "next/link";
import React, { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        // Simulasi login sukses
        document.cookie = "isLoggedIn=true; path=/";
        router.push("/");
        router.refresh(); // Memaksa pembaruan state router
    };

    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email / Username
                </label>
                <input
                    type="email"
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
                    required
                    placeholder="Masukkan password"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
                />
            </div>

            <div className="pt-2">
                <button type="submit" className="block text-center w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">
                    Login
                </button>
            </div>
        </form>
    );
}