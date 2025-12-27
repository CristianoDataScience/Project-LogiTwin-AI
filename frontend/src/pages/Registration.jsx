import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import api from '../api';
import { Truck, Users, Plus } from 'lucide-react';

export default function Registration() {
    const [activeTab, setActiveTab] = useState('trucks'); // trucks, drivers
    const [trucks, setTrucks] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTruck, setNewTruck] = useState({ license_plate: '', capacity: 1000 });
    const [newDriver, setNewDriver] = useState({ name: '', cnh: '', role: 'Motorista' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [resTrucks, resDrivers] = await Promise.all([
            api.get('/api/trucks'),
            api.get('/api/drivers').catch(() => ({ data: [] }))
        ]);
        setTrucks(resTrucks.data);
        setDrivers(resDrivers.data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (activeTab === 'trucks') {
                await api.post('/api/trucks', newTruck);
                setNewTruck({ license_plate: '', capacity: 1000 });
            } else {
                await api.post('/api/drivers', newDriver);
                setNewDriver({ name: '', cnh: '', role: 'Motorista' });
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert('Erro ao realizar cadastro.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Central de Cadastros">
            <div className="bg-surface rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('trucks')}
                        className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition ${activeTab === 'trucks' ? 'bg-primary text-white' : 'text-secondary hover:bg-slate-50'}`}
                    >
                        <Truck className="h-5 w-5" />
                        Frota de Caminhões ({trucks.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('drivers')}
                        className={`flex-1 py-4 text-center font-bold flex items-center justify-center gap-2 transition ${activeTab === 'drivers' ? 'bg-primary text-white' : 'text-secondary hover:bg-slate-50'}`}
                    >
                        <Users className="h-5 w-5" />
                        Pessoas & Equipe ({drivers.length})
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-primary">
                                {activeTab === 'trucks' ? 'Gerenciamento de Ativos' : 'Recursos Humanos'}
                            </h2>
                            <p className="text-sm text-secondary">
                                {activeTab === 'trucks' ? 'Cadastre e monitore os veículos da sua operação.' : 'Gerencie motoristas, operadores e administradores.'}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-accent hover:opacity-90 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition"
                        >
                            <Plus className="h-5 w-5" />
                            {activeTab === 'trucks' ? 'Novo Caminhão' : 'Nova Pessoa'}
                        </button>
                    </div>

                    {activeTab === 'trucks' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {trucks.map(t => (
                                <div key={t.id} className="p-4 border border-slate-200 rounded-lg flex items-center gap-4 hover:border-primary transition cursor-pointer">
                                    <div className="bg-slate-100 p-3 rounded-xl"><Truck className="h-6 w-6 text-primary" /></div>
                                    <div>
                                        <p className="font-bold text-slate-800">{t.license_plate}</p>
                                        <p className="text-xs text-secondary uppercase font-semibold">{t.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {drivers.map(d => (
                                <div key={d.id} className="p-4 border border-slate-200 rounded-lg flex items-center gap-4 hover:border-primary transition cursor-pointer">
                                    <div className="bg-slate-100 p-3 rounded-xl"><Users className="h-6 w-6 text-accent" /></div>
                                    <div>
                                        <p className="font-bold text-slate-800">{d.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-secondary font-bold uppercase">{d.role || 'Membro'}</span>
                                            {d.cnh && <p className="text-[10px] text-secondary font-medium">CNH: {d.cnh}</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {drivers.length === 0 && (
                                <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-xl">
                                    <p className="text-secondary">Nenhum colaborador registrado no sistema.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={activeTab === 'trucks' ? 'Registrar Novo Veículo' : 'Registrar Novo Colaborador'}
            >
                <form onSubmit={handleCreate} className="space-y-4 pt-2">
                    {activeTab === 'trucks' ? (
                        <>
                            <div>
                                <label className="block text-slate-700 font-medium text-sm mb-1.5">Placa do Veículo (ex: ABC-1234)</label>
                                <input className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition" value={newTruck.license_plate} onChange={e => setNewTruck({ ...newTruck, license_plate: e.target.value })} placeholder="TRK-0000" required />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-medium text-sm mb-1.5">Capacidade de Carga (kg)</label>
                                <input className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition" type="number" value={newTruck.capacity} onChange={e => setNewTruck({ ...newTruck, capacity: e.target.value })} required />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-slate-700 font-medium text-sm mb-1.5">Nome Completo</label>
                                <input className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition" value={newDriver.name} onChange={e => setNewDriver({ ...newDriver, name: e.target.value })} placeholder="João Silva" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-700 font-medium text-sm mb-1.5">Cargo / Função</label>
                                    <select
                                        className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition"
                                        value={newDriver.role}
                                        onChange={e => setNewDriver({ ...newDriver, role: e.target.value })}
                                    >
                                        <option value="Motorista">Motorista</option>
                                        <option value="Operador">Operador</option>
                                        <option value="Gerente">Gerente</option>
                                        <option value="Suporte">Suporte</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-700 font-medium text-sm mb-1.5">CNH (Se motorista)</label>
                                    <input className="w-full border border-slate-200 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-primary outline-none transition" value={newDriver.cnh} onChange={e => setNewDriver({ ...newDriver, cnh: e.target.value })} placeholder="000000000" />
                                </div>
                            </div>
                        </>
                    )}
                    <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-md transition-all active:scale-[0.98] mt-4">
                        {loading ? 'Processando...' : 'Finalizar Cadastro'}
                    </button>
                </form>
            </Modal>
        </Layout>
    );
}
