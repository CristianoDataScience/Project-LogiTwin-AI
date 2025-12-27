import { useState } from 'react';
import Layout from '../components/Layout';
import api from '../api';
import { CloudRain, AlertTriangle, ArrowRight } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export default function Simulation() {
    const [weather, setWeather] = useState('clear');
    const [traffic, setTraffic] = useState(1.0);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const { setIsSimulating } = useSimulation();

    const runSimulation = async () => {
        setLoading(true);
        try {
            const res = await api.post('/api/simulations/run', {
                weather,
                traffic_factor: parseFloat(traffic)
            });
            setResults(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Motor de Simulação IA">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="bg-surface p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-primary mb-4">Parâmetros da Simulação</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">Condição Climática</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['Claro', 'Chuva', 'Tempestade'].map(w => (
                                    <button
                                        key={w}
                                        onClick={() => setWeather(w === 'Claro' ? 'clear' : w === 'Chuva' ? 'rain' : 'storm')}
                                        className={`p-3 rounded-lg border capitalize ${(weather === 'clear' && w === 'Claro') || (weather === 'rain' && w === 'Chuva') || (weather === 'storm' && w === 'Tempestade')
                                            ? 'bg-accent text-white border-accent'
                                            : 'bg-white text-secondary border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        {w}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Intensidade do Tráfego: {traffic}x
                            </label>
                            <input
                                type="range"
                                min="1.0"
                                max="2.0"
                                step="0.1"
                                value={traffic}
                                onChange={(e) => setTraffic(e.target.value)}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-secondary mt-1">
                                <span>Normal (1.0x)</span>
                                <span>Pesado (2.0x)</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setIsSimulating(true);
                                runSimulation();
                            }}
                            disabled={loading}
                            className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 text-white font-bold transition ${loading ? 'bg-slate-400' : 'bg-primary hover:bg-slate-800'
                                }`}
                        >
                            <CloudRain className="h-5 w-5" />
                            <span>{loading ? 'Simulando...' : 'Entrar em Modo Simulação IA'}</span>
                        </button>
                    </div>
                </div>

                {/* Timeline */}
                {results && (
                    <div className="bg-surface p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
                        <h2 className="text-lg font-bold text-primary mb-4">⏱️ Linha do Tempo da Crise (Simulação)</h2>
                        <div className="relative border-l-2 border-indigo-100 ml-4 space-y-6 pb-2">
                            <div className="relative pl-6">
                                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-indigo-500 ring-4 ring-white"></span>
                                <p className="text-xs text-indigo-500 font-bold">AGORA (+5 min)</p>
                                <p className="text-sm font-medium text-slate-800">IA detecta aumento repentino de tráfego</p>
                            </div>
                            <div className="relative pl-6">
                                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-red-500 ring-4 ring-white"></span>
                                <p className="text-xs text-red-500 font-bold">+15 min</p>
                                <p className="text-sm font-medium text-slate-800">Previsão de gargalo no CD São Paulo (Capacidade &gt; 90%)</p>
                            </div>
                            <div className="relative pl-6">
                                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-amber-500 ring-4 ring-white"></span>
                                <p className="text-xs text-amber-500 font-bold">+30 min</p>
                                <p className="text-sm font-medium text-slate-800">Atraso na Rota 4B excede o limite contratual</p>
                            </div>
                            <div className="relative pl-6">
                                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-green-500 ring-4 ring-white"></span>
                                <p className="text-xs text-green-500 font-bold">SOLUÇÃO PREVISTA (+35 min)</p>
                                <p className="text-sm font-medium text-slate-800">Aplicação automática de rota alternativa normaliza o fluxo.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results */}
                <div className="bg-surface p-6 rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-lg font-bold text-primary mb-4">Resultados da Simulação</h2>

                    {!results ? (
                        <div className="h-48 flex items-center justify-center text-secondary">
                            Execute uma simulação para ver as previsões da IA.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center">
                                <span className="text-secondary">Atraso Total Previsto</span>
                                <span className="text-xl font-bold text-red-500">{results.overall_delay_minutes.toFixed(0)} min</span>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">Recomendações da IA</h3>
                                <div className="space-y-3">
                                    {results.suggested_actions.length === 0 ? (
                                        <p className="text-green-600">Nenhum problema crítico detectado.</p>
                                    ) : (
                                        results.suggested_actions.map((action, i) => (
                                            <div key={i} className="flex items-start space-x-3 p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                                                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                                                <span className="text-sm text-primary">{action}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <button className="text-accent text-sm font-medium flex items-center hover:underline">
                                    Aplicar Otimização <ArrowRight className="h-4 w-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
