import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import { Package } from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        api.get('/api/orders').then(res => setOrders(res.data));
    }, []);

    return (
        <Layout title="Gestão de Pedidos">
            <div className="bg-surface rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-medium text-secondary">Cliente</th>
                            <th className="p-4 font-medium text-secondary">Peso</th>
                            <th className="p-4 font-medium text-secondary">Status</th>
                            <th className="p-4 font-medium text-secondary">Caminhão Atribuído</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50">
                                <td className="p-4 font-medium text-primary">{order.customer_name}</td>
                                <td className="p-4 text-secondary">{order.weight} tons</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'ENTREGUE' ? 'bg-green-100 text-green-700' :
                                            order.status === 'ATRIBUÍDO' ? 'bg-blue-100 text-blue-700' :
                                                'bg-slate-100 text-slate-600'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-secondary">{order.assigned_truck_id ? `#${order.assigned_truck_id}` : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
