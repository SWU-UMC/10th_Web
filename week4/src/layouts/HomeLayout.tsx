import { Outlet } from 'react-router-dom';


function HomeLayout() {
    return (
        <div className="h-dvh flex flex-col">
            <nav>네비게이션입니다.</nav>
            <main className="flex-1">
                <Outlet />
            </main>
            <footer>푸터입니다.</footer>
        </div>
    );

}
export default HomeLayout;