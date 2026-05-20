import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

export default function MobileLayout() {
  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto pb-28 pt-3 px-4 scroll-smooth">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
