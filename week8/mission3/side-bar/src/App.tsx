
import "./App.css"
import { HamburgerButton } from "./components/HamburgetButton";
import {useSidebar} from "../hooks/useSidebar"
import { Sidebar } from "./components/Sidebar";
function App() {
  const {isOpen, toggle, close}=useSidebar();
  return (
    
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="fixed top-0 left-0 bg-white shadow-sm z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <HamburgerButton isOpen={isOpen} onClick={toggle}/>
          <h1 className="text-xl font-bold text-gray-900">Lp 사이트</h1>
          </div>
        </div>
      </header>
      <Sidebar isOpen={isOpen} onClose={close}/>
    </div>
  );
}
export default App;

