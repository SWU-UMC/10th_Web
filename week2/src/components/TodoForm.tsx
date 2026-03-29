import { useState } from 'react';
import { useTodo } from '../context/TodoContext';

const TodoForm = () => {
  const [input, setInput] = useState('');
  const { addTodo } = useTodo(); 

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (text) {
      addTodo(text);
      setInput('');
    }
  };

  return (
    <form className="todo-container__form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-container__input"
        placeholder="할 일을 입력해주세요"
        required
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit" className="todo-container__button">할 일 추가</button>
    </form>
  );
};

export default TodoForm;