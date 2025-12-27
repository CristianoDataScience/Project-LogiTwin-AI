import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import { Map } from 'lucide-react';

export default function RoutesView() {
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        api.get('/api/routes').then(res => setRoutes(res.data));
    }, []);

    return (
        <Layout title="Rotas Ativas">
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
        </Layout>
    );
}
