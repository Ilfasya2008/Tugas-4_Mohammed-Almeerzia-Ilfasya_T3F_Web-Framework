'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import LogoutButton from './LogoutButton';
import { todoService } from '@/services/todoService';
import { authService } from '@/services/authService';
import { Todo } from '@/types/todo';

export default function TodoApp() {
    const router = useRouter();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Mengambil daftar tugas dari backend database
    const fetchTodos = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const data = await todoService.getTodos();
            setTodos(data);
        } catch (err: any) {
            console.error('Gagal mengambil daftar tugas:', err);
            if (err?.status === 401 || err?.message?.toLowerCase().includes('token')) {
                authService.logout();
                router.push('/login');
                return;
            }
            setError(err?.message || 'Gagal memuat tugas dari database.');
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            router.push('/login');
            return;
        }
        fetchTodos();
    }, [fetchTodos, router]);

    // 1. Tambah Tugas ke Database
    const handleAddTodo = async (title: string) => {
        try {
            const createdTodo = await todoService.createTodo(title);
            setTodos((prev) => [createdTodo, ...prev]);
        } catch (err: any) {
            alert(err?.message || 'Gagal menambahkan tugas ke database.');
        }
    };

    // 2. Ubah Status Tugas (Checklist) di Database
    const handleToggleTodo = async (id: number) => {
        const targetTodo = todos.find((t) => t.id === id);
        if (!targetTodo) return;

        const newCompleted = !targetTodo.completed;

        // Optimistic update
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
        );

        try {
            await todoService.updateTodoStatus(id, newCompleted);
        } catch (err: any) {
            // Rollback jika gagal
            setTodos((prev) =>
                prev.map((t) => (t.id === id ? { ...t, completed: targetTodo.completed } : t))
            );
            alert(err?.message || 'Gagal memperbarui status tugas.');
        }
    };

    // 3. Hapus Tugas dari Database
    const handleDeleteTodo = async (id: number) => {
        const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus tugas ini?');
        if (!confirmDelete) return;

        const originalTodos = todos;
        // Optimistic delete
        setTodos((prev) => prev.filter((t) => t.id !== id));

        try {
            await todoService.deleteTodo(id);
        } catch (err: any) {
            // Rollback jika gagal
            setTodos(originalTodos);
            alert(err?.message || 'Gagal menghapus tugas dari database.');
        }
    };

    return (
        <div>
            {/* Header Toolbar: Status & Logout */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <span className="text-xs text-gray-500 font-medium">
                    Terhubung ke Database MySQL
                </span>
                <LogoutButton />
            </div>

            {/* Form Input Tambah Tugas */}
            <TodoForm onAddTodo={handleAddTodo} />

            {/* Pesan Error jika ada */}
            {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
                    {error}
                </div>
            )}

            {/* List Tugas atau State Loading */}
            {loading ? (
                <div className="text-center py-10 text-gray-500">
                    <p className="animate-pulse">Memuat daftar tugas dari database...</p>
                </div>
            ) : (
                <TodoList
                    todos={todos}
                    onToggleTodo={handleToggleTodo}
                    onDeleteTodo={handleDeleteTodo}
                />
            )}
        </div>
    );
}
