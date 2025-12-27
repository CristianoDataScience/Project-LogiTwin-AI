import Sidebar from './Sidebar';
import { Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Layout({ children, title }) {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    return (
        <div className="flex h-screen bg-background font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 bg-surface border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
                    <h1 className="text-xl font-bold text-primary">{title}</h1>
                    <div className="flex items-center space-x-6">
                        <button className="relative p-2 rounded-full hover:bg-slate-100 transition">
                            <Bell className="h-5 w-5 text-secondary" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div onClick={handleLogout} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-slate-100 transition">
                            <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                                A
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-primary">Admin User</p>
                                <p className="text-xs text-secondary">Logistics Manager</p>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
