import { apiClient } from './api';
import { Todo } from '@/types/todo';
import { ApiTodo, TodosApiResponse } from '@/types/api-todo';

export interface BackendTodoItem {
    id: number;
    todo: string;
    completed: boolean;
    created_at?: string;
}

export interface BackendTodosResponse {
    success: boolean;
    message: string;
    data: BackendTodoItem[];
    meta?: {
        pagination?: {
            page: number;
            perPage: number;
            total: number;
            totalPages: number;
        };
    };
}

export interface BackendSingleTodoResponse {
    success: boolean;
    message: string;
    data: BackendTodoItem;
}

export interface FetchTodosParams {
    limit?: number;
    skip?: number;
    page?: number;
    perPage?: number;
}

export interface CreateTodoInput {
    todo: string;
    completed?: boolean;
    userId?: number;
}

export const todoService = {
    // 1. Ambil semua todo milik user yang login (Database Express)
    async getTodos(page = 1, perPage = 50): Promise<Todo[]> {
        const response = await apiClient<BackendTodosResponse>(
            `/todos?page=${page}&perPage=${perPage}`
        );

        return (response.data || []).map((item) => ({
            id: item.id,
            title: item.todo,
            completed: Boolean(item.completed),
            createdAt: item.created_at || new Date().toISOString().split('T')[0],
        }));
    },

    // 2. Ambil detail satu todo berdasarkan ID (Database Express)
    async getTodoById(id: number | string): Promise<Todo | null> {
        try {
            const response = await apiClient<BackendSingleTodoResponse>(`/todos/${id}`);
            if (!response.data) return null;

            return {
                id: response.data.id,
                title: response.data.todo,
                completed: Boolean(response.data.completed),
                createdAt: response.data.created_at || new Date().toISOString().split('T')[0],
            };
        } catch {
            return null;
        }
    },

    // 3. Tambah todo baru (Database Express)
    async createTodo(payload: string | CreateTodoInput): Promise<Todo> {
        const taskText = typeof payload === 'string' ? payload : payload.todo;
        const response = await apiClient<BackendSingleTodoResponse>('/todos', {
            method: 'POST',
            body: JSON.stringify({ task: taskText }),
        });

        return {
            id: response.data.id,
            title: response.data.todo,
            completed: Boolean(response.data.completed),
            createdAt: new Date().toISOString().split('T')[0],
        };
    },

    // 4. Update task atau status todo secara dinamis
    async updateTodo(
        id: number | string,
        data: { task?: string; is_completed?: boolean }
    ): Promise<void> {
        await apiClient(`/todos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // 5. Update status checklist (completed)
    async updateTodoStatus(id: number | string, isCompleted: boolean): Promise<void> {
        await this.updateTodo(id, { is_completed: isCompleted });
    },

    // 6. Hapus todo berdasarkan ID
    async deleteTodo(id: number | string): Promise<void> {
        await apiClient(`/todos/${id}`, {
            method: 'DELETE',
        });
    },

    // Helper untuk kompatibilitas tugas sebelumnya (lib/tasks.ts & app/api/todos/route.ts)
    async fetchTodos(params: FetchTodosParams = { limit: 15, skip: 0 }): Promise<TodosApiResponse> {
        const { limit = 15, skip = 0 } = params;
        const page = Math.floor(skip / limit) + 1;
        const response = await apiClient<BackendTodosResponse>(`/todos?page=${page}&perPage=${limit}`);
        const todosList: ApiTodo[] = (response.data || []).map((t) => ({
            id: t.id,
            todo: t.todo,
            completed: Boolean(t.completed),
            userId: 1,
        }));
        return {
            todos: todosList,
            total: response.meta?.pagination?.total || todosList.length,
            skip,
            limit,
        };
    },

    async fetchTodoById(id: number | string): Promise<ApiTodo> {
        const todo = await this.getTodoById(id);
        if (!todo) {
            throw new Error(`Todo dengan ID ${id} tidak ditemukan`);
        }
        return {
            id: todo.id,
            todo: todo.title,
            completed: todo.completed,
            userId: 1,
        };
    },
};