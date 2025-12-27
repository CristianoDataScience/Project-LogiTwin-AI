import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-surface w-full max-w-md rounded-xl shadow-2xl border border-slate-200 transform transition-all scale-100 p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-bold text-primary mb-4">{title}</h2>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}
