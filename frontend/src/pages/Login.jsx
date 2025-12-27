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
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="bg-surface p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-200">
                <div className="flex justify-center mb-6">
                    <Truck className="h-12 w-12 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6 text-primary">Logistics Twin AI</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-secondary">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg hover:bg-slate-800 transition">
                        Sign In
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-secondary">
                    Don't have an account? <Link to="/register" className="text-accent hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}
