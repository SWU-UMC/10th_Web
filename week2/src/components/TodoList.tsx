import type { TTodo } from '../types/todo';

interface TodoListProps {
  title: string;
  todos: TTodo[];
  buttonLabel: string;
  buttonColor: string;
  onClick: (todo: TTodo) => void;
}

const TodoList = ({ title, todos, buttonLabel, buttonColor, onClick }: TodoListProps) => {
  return (
    <div className="render-container__section">
      <h2 className="render-container__title">{title}</h2>
      <div className="render-container__list">
        {todos.map((todo) => (
          <div key={todo.id} className="render-container__item">
            <span className="render-container__item-text">{todo.text}</span>
            <button
              className="render-container__item-button"
              style={{ backgroundColor: buttonColor, color: 'white', border: 'none', padding: '5px 10px' }}
              onClick={() => onClick(todo)}
            >
              {buttonLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;