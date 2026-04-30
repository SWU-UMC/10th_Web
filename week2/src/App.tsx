import './App.css'; 
import { TodoProvider } from './context/TodoContext';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { useTodo } from './context/TodoContext'; 


const TodoMain = () => {
  const { todos, doneTodos, completeTodo, deleteTodo } = useTodo();

  return (
    <div className="todo-container">
      <div className="todo-container__header">
        <h1>Dori Todo</h1>
      </div>

      <TodoForm />

      <div className="render-container">
        <TodoList 
          title="할 일" 
          todos={todos} 
          buttonLabel="완료" 
          buttonColor="#28a745" 
          onClick={completeTodo} 
        />
        
        <TodoList 
          title="완료" 
          todos={doneTodos} 
          buttonLabel="삭제" 
          buttonColor="#dc3545" 
          onClick={deleteTodo} 
        />
      </div>
    </div>
  );
};

function App() {
  return (
    <TodoProvider>
      <TodoMain />
    </TodoProvider>
  );
}

export default App;