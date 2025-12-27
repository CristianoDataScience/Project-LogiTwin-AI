import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import { DollarSign, Clock, AlertTriangle, Activity } from 'lucide-react';
import MapComponent from '../components/MapComponent';

function StatCard({ title, value, icon: Icon, color }) {
    return (
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className={`p-4 rounded-lg bg-opacity-10 ${color.bg} ${color.text}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-secondary">{title}</p>
                <p className="text-2xl font-bold text-primary">{value}</p>
            </div>
        </div>
    )
}

export default function Dashboard() {
    const [stats, setStats] = useState({ total_orders: 0, active_trucks: 0, delayed_orders: 0, bottlenecks: 0 });
    const [trucks, setTrucks] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [cds, setCds] = useState([]);

    // UI State
    const [showBottlenecks, setShowBottlenecks] = useState(true);
    const [showAltRoutes, setShowAltRoutes] = useState(true);
    const [advisorVisible, setAdvisorVisible] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resStats, resTrucks, resRoutes, resCds] = await Promise.all([
                    api.get('/api/dashboard'),
                    api.get('/api/trucks'),
                    api.get('/api/routes'),
                    api.get('/api/distribution_centers')
                ]);
                setStats(resStats.data);
                setTrucks(resTrucks.data);
                setRoutes(resRoutes.data);
                setCds(resCds.data);
            } catch (e) {
                console.error("Failed to fetch dashboard data", e);
            }
        };
        fetchData();
    }, []);

    const handleApplyPlan = () => {
        alert("✅ Plano de Contingência Aplicado!\n\nCaminhão #TRK-204 redirecionado.\nNotificação enviada ao motorista.");
        setAdvisorVisible(false);
    };

    const handleSimulate = () => {
        alert("🔄 Simulando impacto...\n\nResultado: Redução de 15% no custo operacional confirmada.");
    };

    return (
        <Layout title="Visão Geral da Operação">
            {/* Business Impact KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Custo em Risco"
                    value={`R$ ${stats.risk_cost?.toLocaleString('pt-BR') || '0,00'}`}
                    icon={DollarSign}
                    color={{ bg: 'bg-red-500', text: 'text-red-600' }}
                />
                <StatCard
                    title="Atraso Médio Previsto"
                    value={`${stats.avg_delay || 0} min`}
                    icon={Clock}
                    color={{ bg: 'bg-amber-500', text: 'text-amber-600' }}
                />
                <StatCard
                    title="Operação em Risco"
                    value={`${stats.op_risk_percentage ? stats.op_risk_percentage.toFixed(1) : 0}%`}
                    icon={AlertTriangle}
                    color={{ bg: 'bg-orange-500', text: 'text-orange-600' }}
                />
                <StatCard
                    title="Caminhões Ativos"
                    value={stats.active_trucks}
                    icon={Activity}
                    color={{ bg: 'bg-blue-500', text: 'text-blue-600' }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Map Section */}
                <div className="lg:col-span-2 bg-surface rounded-xl shadow-sm border border-slate-200 h-[32rem] relative z-0 flex flex-col">
                    <div className="absolute top-4 right-4 z-[9999] bg-white/90 p-2 rounded-lg shadow-md text-xs space-y-2 backdrop-blur-sm border border-slate-200">
                        <h4 className="font-bold text-primary mb-1">Camadas Inteligentes</h4>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showBottlenecks}
                                onChange={(e) => setShowBottlenecks(e.target.checked)}
                                className="accent-red-500"
                            />
                            <span>Gargalos Previstos</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showAltRoutes}
                                onChange={(e) => setShowAltRoutes(e.target.checked)}
                                className="accent-blue-500"
                            />
                            <span>Rotas Alternativas IA</span>
                        </label>
                    </div>
                    <MapComponent
                        trucks={trucks}
                        routes={routes}
                        cds={cds}
                        layers={{ bottlenecks: showBottlenecks, altRoutes: showAltRoutes }}
                    />
                </div>

                {/* Tactical Advisor Panel */}
                {advisorVisible ? (
                    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-xl shadow-lg p-6 text-white border border-indigo-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Activity className="h-32 w-32" />
                        </div>

                        <div className="flex items-center space-x-2 mb-6">
                            <div className="bg-green-400 h-2 w-2 rounded-full animate-pulse"></div>
                            <h3 className="text-lg font-bold tracking-wide">IA TACTICAL ADVISOR</h3>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/20">
                                <p className="text-indigo-200 text-xs font-bold uppercase mb-2">Recomendação Prioritária</p>
                                <p className="font-medium text-lg leading-snug">Redirecionar Caminhão #TRK-204 pela Rota Sul devido a bloqueio.</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                                    <span className="text-indigo-300">Atraso evitado</span>
                                    <span className="font-bold text-green-400">42 min</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                                    <span className="text-indigo-300">Economia estimada</span>
                                    <span className="font-bold text-green-400">R$ 1.850,00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-indigo-300">Pedidos salvos</span>
                                    <span className="font-bold">3</span>
                                </div>
                            </div>

                            <div className="pt-4 space-y-3">
                                <button
                                    onClick={handleApplyPlan}
                                    className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg hover:shadow-green-500/30 transition-all transform hover:-translate-y-1"
                                >
                                    Aplicar Plano de Contingência
                                </button>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleSimulate}
                                        className="py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition"
                                    >
                                        Simular Impacto
                                    </button>
                                    <button
                                        onClick={() => setAdvisorVisible(false)}
                                        className="py-2 bg-transparent hover:bg-white/5 text-indigo-300 text-sm font-medium rounded-lg transition border border-white/10"
                                    >
                                        Ignorar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-surface rounded-xl p-6 border border-slate-200 flex flex-col justify-center items-center text-center h-full">
                        <div className="bg-green-50 p-4 rounded-full mb-4">
                            <Activity className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="font-bold text-primary">Operação Otimizada</h3>
                        <p className="text-sm text-secondary mt-2">Nenhuma recomendação crítica no momento.</p>
                        <button
                            onClick={() => setAdvisorVisible(true)}
                            className="mt-4 text-sm text-accent hover:underline"
                        >
                            Ver histórico
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
}

