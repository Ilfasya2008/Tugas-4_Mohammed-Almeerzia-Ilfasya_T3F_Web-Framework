export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class ApiError extends Error {
    status: number;
    statusText: string;

    constructor(message: string, status: number, statusText: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.statusText = statusText;
    }
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                ...(options.headers as Record<string, string> | undefined),
            },
        });

        if (!response.ok) {
            let errorMessage = `HTTP Error: Gagal memuat data dari ${endpoint} (${response.status} ${response.statusText})`;
            try {
                const errorData = await response.json();
                if (errorData && errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch {
                // Ignore json parse error if response is not JSON
            }
            throw new ApiError(errorMessage, response.status, response.statusText);
        }

        const data: T = await response.json();
        return data;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new Error(`Network Error: Tidak dapat terhubung ke server API (${(error as Error).message})`);
    }
}