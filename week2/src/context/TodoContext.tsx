import { createContext, useState, useContext, type PropsWithChildren } from 'react';
import type { TTodo } from '../types/todo';

// 1. 어떤 데이터와 함수들을 관리할 건지 타입 정의
interface ITodoContext {
  todos: TTodo[];
  doneTodos: TTodo[];
  addTodo: (text: string) => void;
  completeTodo: (todo: TTodo) => void;
  deleteTodo: (todo: TTodo) => void;
}

// 2. Context 생성 (초기값은 비워둠)
const TodoContext = createContext<ITodoContext | undefined>(undefined);

// 3. 우산(Provider) 만들기 - 데이터들을 품고 있는 역할
export const TodoProvider = ({ children }: PropsWithChildren) => {
  const [todos, setTodos] = useState<TTodo[]>([]);
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: TTodo = { id: Date.now(), text };
    setTodos((prev) => [...prev, newTodo]);
  };

  const completeTodo = (todo: TTodo) => {
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    setDoneTodos((prev) => [...prev, todo]);
  };

  const deleteTodo = (todo: TTodo) => {
    setDoneTodos((prev) => prev.filter((t) => t.id !== todo.id));
  };

  return (
    <TodoContext.Provider value={{ todos, doneTodos, addTodo, completeTodo, deleteTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

// 4. 컴포넌트에서 편하게 꺼내 쓸 수 있는 커스텀 훅
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo는 TodoProvider 안에서만 사용 가능합니다.');
  }
  return context;
};