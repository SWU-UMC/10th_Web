import { useTheme, THEME } from './context/ThemeProvider';
import ThemeToggleButton from './components/ThemeToggleButton';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  const { theme } = useTheme(); // 👈 현재 테마 가져오기

  return (
    // 테마 상태에 따라 클래스 동적 변경
    <div className={`todo-app ${theme === THEME.DARK ? 'dark-mode' : 'light-mode'}`}>
      <div className="todo-container">
        <header className="todo-header">
          <h1 className="todo-container__header">YONG TODO <ThemeToggleButton /> </h1>
        </header>

        <TodoInput />

        <div className="render-container">
          <TodoList title="할 일" type="todo" />
          <TodoList title="완료" type="done" />
        </div>
      </div>
    </div>
  );
}

export default App;
