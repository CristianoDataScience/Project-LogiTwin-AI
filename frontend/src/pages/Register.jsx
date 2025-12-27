import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register', null, { params: { email, password } });
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Email might be taken.');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="bg-surface p-8 rounded-xl shadow-lg w-full max-w-md border border-slate-200">
                <div className="flex justify-center mb-6">
                    <Truck className="h-12 w-12 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6 text-primary">Create Account</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleRegister} className="space-y-4">
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
                    <button type="submit" className="w-full bg-accent text-white py-2 rounded-lg hover:bg-blue-600 transition">
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-secondary">
                    Already have an account? <Link to="/login" className="text-accent hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
}
