import { useState, useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

const TodoInput = () => {
    const [value, setValue] = useState('');

    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('TodoInput는 반드시 TodoProvider 내부에서 사용되어야 합니다.');
    }

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && context) {
      context.addTodo(value); 
      setValue(''); 
    }
  };

    return (
        <form onSubmit={handleSubmit} className="todo-container__form">
            <input 
                type="text"
                className="todo-container__input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
            />
            <button type="submit" className="todo-container__button">할 일 추가</button>
        </form>
    );
};

export default TodoInput;