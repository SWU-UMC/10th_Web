import { useState } from 'react';
import type { TTodo } from './types/todo';
import './App.css'; 

function App() {
  // 1. 상태(State) 관리
  const [todos, setTodos] = useState<TTodo[]>([]); 
  const [doneTodos, setDoneTodos] = useState<TTodo[]>([]); 
  const [input, setInput] = useState<string>(''); 

  // 2. 할 일 추가 함수
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    const text = input.trim(); 
    if (text) {
      const newTodo: TTodo = {
        id: Date.now(),
        text: text,
      };
    
      setTodos((prevTodos) => [...prevTodos, newTodo]); 
      setInput(''); // 입력창 비우기
    }
  };

  // 3. 완료 처리 
  const completeTodo = (todo: TTodo) => {
    setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
    setDoneTodos((prevDoneTodos) => [...prevDoneTodos, todo]);
  };

  // 4. 삭제 처리 
  const deleteTodo = (todo: TTodo) => {
    setDoneTodos((prevDoneTodos) => prevDoneTodos.filter((t) => t.id !== todo.id));
  };

  return (
    <div className="todo-container">
      <div className="todo-container__header">
        <h1>Dori Todo</h1>
      </div>

      <form className="todo-container__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="todo-container__input"
          placeholder="할 일을 입력해주세요"
          required
          value={input}
          onChange={(e) => setInput(e.target.value)} // 입력할 때마다 input 상태 업데이트
        />
        <button type="submit" className="todo-container__button">할 일 추가</button>
      </form>

      <div className="render-container">
        <div className="render-container__section">
          <h2 className="render-container__title">할 일</h2>
          <div className="render-container__list">
            {todos.map((todo) => (
              <div key={todo.id} className="render-container__item">
                <span className="render-container__item-text">{todo.text}</span>
                <button
                  className="render-container__item-button"
                  style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px' }}
                  onClick={() => completeTodo(todo)} // 완료 버튼 클릭 시
                >
                  완료
                </button>
              </div>
            ))}
          </div>
        </div>

        
        <div className="render-container__section">
          <h2 className="render-container__title">완료</h2>
          <div className="render-container__list">
            {doneTodos.map((todo) => (
              <div key={todo.id} className="render-container__item">
                <span className="render-container__item-text">{todo.text}</span>
                <button
                  className="render-container__item-button"
                  style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px' }}
                  onClick={() => deleteTodo(todo)} // 삭제 버튼 클릭 시
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;