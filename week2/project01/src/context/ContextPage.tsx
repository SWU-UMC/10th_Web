
import Navbar from "./Navbar";
import ThemeContent from "./ThemeContent";
import ThemeToggleButton from "./ThemeToggleButton";
import { ThemeProvider } from "./ThemeProvider";

export default function ContextPage() {
  return (
    <ThemeProvider>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Navbar />
        <main className="flex-1 w-full flex justify-center">
          <ThemeToggleButton />
        </main>
        <ThemeContent />
      </div>
    </ThemeProvider>
  );
}


