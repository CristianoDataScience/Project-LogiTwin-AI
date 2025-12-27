import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import api from '../api';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'system', content: 'Olá! Sou a IA Operacional. Como posso ajudar na sua operação hoje?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/api/chat/', { message: userMsg });
            setMessages(prev => [...prev, { role: 'system', content: res.data.response }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'system', content: 'Erro ao conectar. Tente novamente.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-primary hover:bg-slate-800 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
                >
                    <MessageSquare className="h-6 w-6" />
                    <span className="font-bold pr-2">Perguntar à IA</span>
                </button>
            )}

            {isOpen && (
                <div className="bg-white rounded-xl shadow-2xl w-80 md:w-96 flex flex-col border border-slate-200" style={{ height: '500px' }}>
                    {/* Header */}
                    <div className="bg-primary text-white p-4 rounded-t-xl flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-green-400 h-2 w-2 rounded-full animate-pulse"></div>
                            <h3 className="font-bold">IA Operacional</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-slate-300">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user'
                                        ? 'bg-primary text-white rounded-br-none'
                                        : 'bg-white border border-slate-200 text-secondary rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-bl-none shadow-sm text-xs text-secondary italic">
                                    Digitando...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-slate-100 bg-white rounded-b-xl flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Ex: Qual o maior risco hoje?"
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading}
                            className="bg-primary text-white p-2 rounded-lg hover:bg-slate-800 disabled:opacity-50"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
