import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../api';
import { Map } from 'lucide-react';

export default function RoutesView() {
    const [routes, setRoutes] = useState([]);



    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cds, setCds] = useState([]);
    const [newRoute, setNewRoute] = useState({ origin_id: '', destination_id: '', distance_km: 100, estimated_time_min: 120 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get('/api/routes').then(res => setRoutes(res.data));
        api.get('/api/distribution_centers').then(res => setCds(res.data));
    }, []);

    const handleCreateRoute = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/routes', {
                ...newRoute,
                origin_id: parseInt(newRoute.origin_id),
                destination_id: parseInt(newRoute.destination_id)
            });
            setIsModalOpen(false);
            setNewRoute({ origin_id: '', destination_id: '', distance_km: 100, estimated_time_min: 120 });
            // Refresh list
            const res = await api.get('/api/routes');
            setRoutes(res.data);
        } catch (error) {
            alert('Erro ao criar rota. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Rotas Ativas">
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm"
                >
                    <Map className="h-5 w-5" />
                    <span>Nova Rota</span>
                </button>
            </div>

            <div className="space-y-4">
                {routes.map(route => (
                    <div key={route.id} className="bg-surface p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                <Map className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-bold text-primary">Rota #{route.id}</p>
                                <p className="text-sm text-secondary">{route.distance_km} km • {route.estimated_time_min} min</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${route.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {route.is_active ? 'ATIVA' : 'INATIVA'}
                        </span>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar Nova Rota">
                <form onSubmit={handleCreateRoute} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1">Origem (CD)</label>
                            <select
                                required
                                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none bg-white"
                                value={newRoute.origin_id}
                                onChange={e => setNewRoute({ ...newRoute, origin_id: e.target.value })}
                            >
                                <option value="">Selecione...</option>
                                {cds.map(cd => <option key={cd.id} value={cd.id}>{cd.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1">Destino (CD)</label>
                            <select
                                required
                                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none bg-white"
                                value={newRoute.destination_id}
                                onChange={e => setNewRoute({ ...newRoute, destination_id: e.target.value })}
                            >
                                <option value="">Selecione...</option>
                                {cds.map(cd => <option key={cd.id} value={cd.id}>{cd.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1">Distância (km)</label>
                            <input
                                type="number"
                                required
                                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none"
                                value={newRoute.distance_km}
                                onChange={e => setNewRoute({ ...newRoute, distance_km: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1">Tempo Est. (min)</label>
                            <input
                                type="number"
                                required
                                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none"
                                value={newRoute.estimated_time_min}
                                onChange={e => setNewRoute({ ...newRoute, estimated_time_min: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition"
                    >
                        {loading ? 'Criando Rota...' : 'Salvar Rota'}
                    </button>
                    <p className="text-xs text-secondary text-center mt-2">Os waypoints da rota são gerados automaticamente pela IA.</p>
                </form>
            </Modal>
        </Layout>
    );
}
