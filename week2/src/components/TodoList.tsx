import { useContext } from 'react';
import { TodoContext } from '../context/TodoContext'; 
import { type Task } from '../types'; 
import TodoItem from './TodoItem';

interface TodoLiskProps {
    title: string;
    type: 'todo' | 'done'; // 어떤 목록인지 구분하기 위한 타입
}

const TodoList = ({ title, type }: TodoLiskProps) => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('TodoList는 반드시 TodoProvider 내부에서 사용되어야 합니다.');
    }

    // type에 따라 todos 또는 doneTasks를 선택
    const tasks: Task[] = type === 'todo' ? context.todos : context.doneTasks;

    return (
        <div className="render-container__section">
            <h2 className="render-container__title">{title}</h2>
            <ul className="render-container__list">
                {tasks.map((task) => (
                    <TodoItem
                        key={task.id}
                        task={task}
                        isDone={type === 'done'}
                    />
                ))}
            </ul>
        </div>
    );
}

export default TodoList;