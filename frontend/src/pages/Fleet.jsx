import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../api';
import { Truck } from 'lucide-react';

export default function Fleet() {
    const [trucks, setTrucks] = useState([]);

    useEffect(() => {
        api.get('/api/trucks').then(res => setTrucks(res.data));
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTruck, setNewTruck] = useState({ license_plate: '', capacity: 1000 });
    const [loading, setLoading] = useState(false);

    const handleCreateTruck = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/trucks', newTruck);
            setIsModalOpen(false);
            setNewTruck({ license_plate: '', capacity: 1000 });
            // Refresh list
            const res = await api.get('/api/trucks');
            setTrucks(res.data);
        } catch (error) {
            alert('Erro ao criar caminhão');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Gestão da Frota">
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-sm"
                >
                    <Truck className="h-5 w-5" />
                    <span>Adicionar Caminhão</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trucks.map(truck => (
                    <div key={truck.id} className="bg-surface p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Truck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-bold text-primary">{truck.license_plate}</p>
                            <p className="text-sm text-secondary capitalize">{
                                truck.status === 'IN_TRANSIT' ? 'EM TRÂNSITO' :
                                    truck.status === 'IDLE' ? 'PARADO' :
                                        truck.status // Should already be Portuguese if from mock_data, but safety fallback
                            }</p>
                            <div className="mt-2 w-full bg-slate-100 rounded-full h-2 w-32">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${truck.current_load}%` }}></div>
                            </div>
                            <p className="text-xs text-secondary mt-1">{truck.current_load}% Carga</p>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Cadastrar Novo Caminhão">
                <form onSubmit={handleCreateTruck} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">Placa do Veículo</label>
                        <input
                            type="text"
                            required
                            placeholder="Ex: ABC-1234"
                            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none"
                            value={newTruck.license_plate}
                            onChange={e => setNewTruck({ ...newTruck, license_plate: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">Capacidade (kg)</label>
                        <input
                            type="number"
                            required
                            className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-accent outline-none"
                            value={newTruck.capacity}
                            onChange={e => setNewTruck({ ...newTruck, capacity: parseInt(e.target.value) })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition"
                    >
                        {loading ? 'Cadastrando...' : 'Confirmar Cadastro'}
                    </button>
                </form>
            </Modal>
        </Layout>
    );
}
