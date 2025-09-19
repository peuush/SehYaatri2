import { useState } from "react";

export default function Auth() {
    const [mode, setMode] = useState<'login'|'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [token, setToken] = useState<string | null>(localStorage.getItem('owner_token'));
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        setError(null);
        setLoading(true);
        try {
            const path = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
            const res = await fetch(path, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });
            const data = await res.json();
            if (!res.ok) { setError(data?.error || 'Error'); return; }
            localStorage.setItem('owner_token', data.token);
            setToken(data.token);
        } finally {
            setLoading(false);
        }
    };

    if (token) {
        return (
            <div className="min-h-[80vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50 via-white to-brand-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
                <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl backdrop-blur bg-white/70 dark:bg-slate-800/70 ring-1 ring-slate-200 dark:ring-slate-700 shadow-2xl">
                    <div className="absolute -top-24 -right-24 h-64 w-64 bg-brand-400/40 blur-3xl rounded-full" />
                    <div className="p-8 relative">
                        <div className="flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white font-bold">S</span>
                            <h2 className="text-2xl font-bold">Owner Dashboard</h2>
                        </div>
                        <p className="mt-2 text-slate-600 dark:text-slate-300">You are signed in. Use the link below to open the feedback API response or sign out.</p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <a href="/api/feedback" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700">View Feedback (JSON)</a>
                            <button onClick={() => { localStorage.removeItem('owner_token'); setToken(null); }} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">Sign out</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 py-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50 via-white to-brand-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center opacity-10 dark:opacity-20" />
            <div className="relative w-full max-w-md">
                <div className="overflow-hidden rounded-3xl backdrop-blur bg-white/70 dark:bg-slate-800/70 ring-1 ring-slate-200 dark:ring-slate-700 shadow-xl">
                    <div className="px-6 pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white font-bold">S</span>
                                <span className="text-lg font-semibold">SehYaatri Admin</span>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-700 rounded-full p-1">
                                <button onClick={() => setMode('login')} className={`px-3 py-1 text-sm rounded-full ${mode==='login'?'bg-white dark:bg-slate-800 shadow':'text-slate-600 dark:text-slate-300'}`}>Sign in</button>
                                <button onClick={() => setMode('signup')} className={`px-3 py-1 text-sm rounded-full ${mode==='signup'?'bg-white dark:bg-slate-800 shadow':'text-slate-600 dark:text-slate-300'}`}>Sign up</button>
                            </div>
                        </div>
                        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
                        {mode === 'signup' && (
                            <div className="mt-4">
                                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Name</label>
                                <input value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-700/80 focus:outline-none" />
                            </div>
                        )}
                        <div className="mt-4">
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
                            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-700/80 focus:outline-none" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Password</label>
                            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-700/80 focus:outline-none" />
                        </div>
                    </div>
                    <div className="px-6 pb-6">
                        <button onClick={submit} disabled={loading} className="mt-6 w-full px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50">
                            {loading ? 'Please wait…' : (mode === 'login' ? 'Sign in' : 'Create account')}
                        </button>
                        <p className="mt-3 text-xs text-center text-slate-500">By continuing you agree to our terms and privacy policy.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}


