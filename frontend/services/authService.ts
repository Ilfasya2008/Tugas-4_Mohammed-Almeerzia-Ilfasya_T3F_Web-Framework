import { apiClient } from './api';

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        token: string;
    };
}

const TOKEN_KEY = 'token';

export const authService = {
    // 1. Registrasi user baru
    async register(payload: RegisterPayload): Promise<AuthResponse> {
        return apiClient<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },

    // 2. Login user
    async login(payload: LoginPayload): Promise<{ token: string }> {
        const res = await apiClient<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(payload),
        });

        if (res.data?.token) {
            this.setToken(res.data.token);
            return res.data;
        }

        throw new Error(res.message || 'Login gagal, periksa kredensial Anda!');
    },

    // 3. Simpan token JWT dan set cookie auth
    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
            // Simpan juga status cookie isLoggedIn untuk middleware Next.js
            document.cookie = `isLoggedIn=true; path=/; max-age=${2 * 60 * 60}`;
        }
    },

    // 4. Ambil token JWT
    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    },

    // 5. Cek apakah user sedang login
    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    // 6. Logout user
    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
            document.cookie = 'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    },
};
