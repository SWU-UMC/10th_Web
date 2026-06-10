import { createContext, useState, type ReactNode } from 'react';
import { type Task } from '../types';

// Context 정의
interface TodoContextType {
    todos: Task[];
    doneTasks: Task[];
    addTodo: (text: string) => void;
    completeTask: (task: Task) => void;
    deleteTask: (task: Task) => void;
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined);

// Provider 컴포넌트
export const TodoProvider = ({ children }: { children: ReactNode}) => {
    const [todos, setTodos] = useState<Task[]>([]);
    const [doneTasks, setDoneTasks] = useState<Task[]>([]);

    const addTodo = (text: string) => {
        setTodos([...todos, {id: Date.now(), text }]);
    };

    const completeTask = (task: Task) => {
        setTodos(todos.filter((t) => t.id !== task.id));
        setDoneTasks([...doneTasks, task]);
    };

    const deleteTask = (task: Task) => {
        setDoneTasks(doneTasks.filter((t) => t.id !== task.id));
    };

    return (
        <TodoContext.Provider value={{todos, doneTasks, addTodo, completeTask, deleteTask}}>
            {children}
        </TodoContext.Provider>
    );
};