import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Truck, Map as MapIcon, Package, PlayCircle, Settings } from 'lucide-react';

const navItems = [
    { name: 'Visão Geral', path: '/', icon: LayoutDashboard },
    { name: 'Rotas', path: '/routes', icon: MapIcon },
    { name: 'Frota', path: '/fleet', icon: Truck },
    { name: 'Pedidos', path: '/orders', icon: Package },
    { name: 'Simulação', path: '/simulation', icon: PlayCircle },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className="w-64 bg-surface h-screen border-r border-slate-200 flex flex-col shadow-sm">
            <div className="p-6 flex items-center space-x-3 border-b border-slate-100">
                <Truck className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-primary tracking-tight">LogiTwin AI</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-primary text-white shadow-md'
                                : 'text-secondary hover:bg-slate-100 hover:text-primary'
                                }`}
                        >
                            <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button className="flex items-center space-x-3 p-3 text-secondary hover:bg-slate-100 rounded-lg w-full transition">
                    <Settings className="h-5 w-5 text-slate-400" />
                    <span className="font-medium">Configurações</span>
                </button>
            </div>
        </div>
    );
}
