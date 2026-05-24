import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="flex flex-col h-[100dvh] bg-[#0b0b0b] text-white antialiased">
      <header className="flex justify-between items-center px-8 py-4 border-b border-[#1f1f1f]">
        <h1 className="text-[#ff2a85] text-lg font-bold tracking-wider">돌려돌려LP판</h1>
      </header>
      <main className="flex-1 flex justify-center items-center bg-[#0b0b0b]">
        <Outlet />
      </main>
    </div>
  );
}