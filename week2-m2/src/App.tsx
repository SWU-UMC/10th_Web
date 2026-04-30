import NavBar from './components/NavBar';
import ThemeContent from './components/ThemeContent';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen transition-colors duration-300">
        <NavBar />
        <ThemeContent />
      </div>
    </ThemeProvider>
  );
}

export default App;