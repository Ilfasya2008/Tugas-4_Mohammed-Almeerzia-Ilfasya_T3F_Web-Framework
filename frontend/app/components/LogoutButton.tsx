"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.push("/login");
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-800 transition"
        >
            Logout
        </button>
    );
}
