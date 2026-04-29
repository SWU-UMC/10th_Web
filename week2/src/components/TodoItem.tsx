import { type Task } from '../types';
import {useContext} from 'react';
import { TodoContext } from '../context/TodoContext';

interface TodoItemProps {
    task: Task;
    isDone: boolean;
}

const TodoItem = ({ task, isDone }: TodoItemProps) => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('TodoItem는 반드시 TodoProvider 내부에서 사용되어야 합니다.');
    }

    return (
        <li className="render-container__item">
            <span className="render-container__item-text">{task.text}</span>
            <button  
                onClick={() => (isDone ? context.deleteTask(task) : context.completeTask(task))}
                className="render-container__item-button"
                style={{ backgroundColor: isDone ? '#dc3545' : '#28a745' }}
            >
                {isDone ? '삭제' : '완료'}
            </button>
        </li>
    );
};

export default TodoItem;