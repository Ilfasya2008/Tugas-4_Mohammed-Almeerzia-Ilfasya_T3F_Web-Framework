'use client';

import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        authService.logout();
        router.push('/login');
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-800 transition cursor-pointer"
        >
            Logout
        </button>
    );
}
