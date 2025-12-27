import Sidebar from './Sidebar';
import Chatbot from './Chatbot';
import { useSimulation } from '../context/SimulationContext';

export default function Layout({ children, title }) {
    const { isSimulating, setIsSimulating } = useSimulation();

    return (
        <div className={`flex h-screen bg-background ${isSimulating ? 'border-4 border-amber-400' : ''}`}>
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden relative">

                {/* Simulation Mode Banner */}
                {isSimulating && (
                    <div className="bg-amber-400 text-amber-900 px-4 py-1 text-xs font-bold text-center uppercase tracking-widest flex justify-between items-center">
                        <span>⚠️ MODO SIMULAÇÃO ATIVO - Nenhuma ação será aplicada</span>
                        <button onClick={() => setIsSimulating(false)} className="underline hover:text-black">Sair</button>
                    </div>
                )}

                <header className="bg-surface border-b border-slate-200">
                    <div className="flex items-center justify-between px-8 py-4">
                        <h1 className="text-2xl font-bold text-primary">{title}</h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex flex-col text-right hidden md:block">
                                <span className="text-sm font-bold text-primary">Admin User</span>
                                <span className="text-xs text-secondary">Logistics Manager</span>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                                A
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
