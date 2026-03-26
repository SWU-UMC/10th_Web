import { useState } from 'react';
import './App.css';

type Todo = {
  id: number;
  text: string;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);  // 해야 할 일 목록
  const [doneTodos, setDoneTodos] = useState<Todo[]>([]); // 완료된 목록
  const [input, setInput] = useState(""); // 입력창 값

  const complete = (todo: Todo) => {
    setDoneTodos(doneTodos.filter((t) => t.id !== todo.id));
  };

  const doneTask = (todo: Todo) => {
    setTodos(todos.filter((t) => t.id !== todo.id));
    setDoneTodos([...doneTodos, todo]);
  };

  const addTodo = () => {
    const text = input.trim();
    if (text === "") return;
    const newTodo: Todo = {
      id: Date.now(),
      text,
    };
    setTodos([...todos, newTodo]);
    setInput("");
  };

  return (
    <>
    <div className='head'>
      <h1>YONG TO DO</h1>
      <div className='header'>
        <input
          type="text"
          placeholder="할 일 입력"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='input-box'
                
        />
        <button onClick={addTodo}>할 일 추가</button>
      </div>
      
      <div className="container">
        <div className="section">
          <h2>할 일</h2>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                {todo.text}
                <button onClick={() => doneTask(todo)} 
                  style={{ backgroundColor: "green", color: "white"}}  
                  >완료</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h2>완료</h2>
          <ul>
            {doneTodos.map((todo) => (
              <li key={todo.id}>
                {todo.text}
                <button onClick={() => complete(todo)}
                  style={{ backgroundColor: "red", color: "white"}}
                  >삭제</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
    </div> 
    </>
  );
}

export default App;