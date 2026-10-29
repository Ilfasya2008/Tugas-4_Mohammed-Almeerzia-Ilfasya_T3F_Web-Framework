'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { todoService } from '@/services/todoService';
import { authService } from '@/services/authService';
import { Todo } from '@/types/todo';
import TaskNotFound from './components/TaskNotFound';
import TaskDetailCard from './components/TaskDetailCard';

export default function TodoDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [todo, setTodo] = useState<Todo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Periksa status login pengguna
        if (!authService.isAuthenticated()) {
            router.push('/login');
            return;
        }

        if (!id) return;

        // 2. Memanggil fungsi todoService.getTodoById(id)
        const fetchTodo = async () => {
            try {
                setLoading(true);
                const data = await todoService.getTodoById(id);
                setTodo(data);
            } catch (error) {
                console.error('Gagal mengambil data todo:', error);
                setTodo(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTodo();
    }, [id, router]);

    if (loading) {
        return (
            <main className="min-h-screen p-8 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 font-medium">Memuat detail tugas...</p>
            </main>
        );
    }

    // 3. Jika data tidak ditemukan, otomatis menampilkan komponen TaskNotFound
    if (!todo) {
        return <TaskNotFound id={id} />;
    }

    return <TaskDetailCard todo={todo} />;
}