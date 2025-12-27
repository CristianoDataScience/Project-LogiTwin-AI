import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await api.post('/token', formData);
            localStorage.setItem('token', response.data.access_token);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>

            <div className="relative z-10 w-full max-w-[440px] px-6">
                <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2rem] border border-white/10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col items-center mb-10">
                        <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg shadow-blue-500/20 mb-6 group transition-transform hover:scale-105">
                            <Truck className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight text-center">LogiTwin AI</h2>
                        <p className="text-slate-400 mt-2 text-sm font-medium">Digital Twin de Próxima Geração</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-3 px-4 rounded-xl text-center mb-6 animate-pulse">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-slate-300 ml-1">E-mail Corporativo</label>
                            <input
                                type="email"
                                required
                                placeholder="exemplo@logistica.com"
                                className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-slate-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[13px] font-semibold text-slate-300 ml-1">Senha de Acesso</label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder:text-slate-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] mt-2"
                        >
                            Entrar no Sistema
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-slate-400 text-sm">
                            Novo por aqui? <Link to="/register" className="text-blue-400 font-bold hover:text-blue-300 transition underline-offset-4 hover:underline">Solicitar Acesso</Link>
                        </p>
                    </div>
                </div>

                {/* Footer simple */}
                <p className="text-center text-slate-500 text-[11px] mt-8 uppercase tracking-widest font-bold">
                    &copy; 2024 LogiTwin AI Systems • Segurança Avançada
                </p>
            </div>
        </div>
    );
}
