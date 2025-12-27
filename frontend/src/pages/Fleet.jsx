import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import { Truck } from 'lucide-react';

export default function Fleet() {
    const [trucks, setTrucks] = useState([]);

    useEffect(() => {
        api.get('/api/trucks').then(res => setTrucks(res.data));
    }, []);

    return (
        <Layout title="Gestão da Frota">
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
        </Layout>
    );
}
