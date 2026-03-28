import { useState } from 'react';
import { TodoProvider } from './context/TodoContext';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import { type Task } from './types';
import './App.css';

function App() {

 return (
    <TodoProvider>
      <div className="todo-container">
        <h1 className="todo-container__header">YONG TODO</h1>

        <TodoInput />

        <div className ="render-container">
          <TodoList title="할 일" type="todo" />
          <TodoList title="완료" type="done" />
        </div>
      </div>

    </TodoProvider>
  );
}

export default App
