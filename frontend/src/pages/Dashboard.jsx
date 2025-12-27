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

    return (
        <Layout title="Visão Geral da Operação">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Caminhões Ativos"
                    value={stats.active_trucks}
                    icon={Activity}
                    color={{ bg: 'bg-blue-500', text: 'text-blue-600' }}
                />
                <StatCard
                    title="Total de Pedidos"
                    value={stats.total_orders}
                    icon={DollarSign}
                    color={{ bg: 'bg-emerald-500', text: 'text-emerald-600' }}
                />
                <StatCard
                    title="Pedidos Atrasados"
                    value={stats.delayed_orders}
                    icon={Clock}
                    color={{ bg: 'bg-amber-500', text: 'text-amber-600' }}
                />
                <StatCard
                    title="Gargalos"
                    value={stats.bottlenecks}
                    icon={AlertTriangle}
                    color={{ bg: 'bg-red-500', text: 'text-red-600' }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-surface rounded-xl shadow-sm border border-slate-200 h-96 relative z-0">
                    <MapComponent trucks={trucks} routes={routes} cds={cds} />
                </div>
                <div className="bg-surface rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-primary mb-4">Alertas Recentes</h3>
                    <div className="space-y-4">
                        {/* Mock Alerts */}
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-red-800">Alerta de Tráfego Intenso {i + 1}</p>
                                    <p className="text-xs text-red-600">Atraso previsto na Rota {i + 1}A</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
