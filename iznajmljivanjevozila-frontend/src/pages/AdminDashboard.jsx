import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../config';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUsersModal, setShowUsersModal] = useState(false);
    const [showRevenueModal, setShowRevenueModal] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(apiUrl('/api/stats'), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(apiUrl('/api/users'), {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsersList(res.data.data || []);
            setShowUsersModal(true);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-xl font-black text-blue-600 animate-bounce">Učitavanje podataka...</div>
        </div>
    );

    if (!stats) return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="bg-red-50 border-2 border-red-100 p-12 rounded-3xl">
                <span className="text-6xl mb-6 block">⚠️</span>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Sistem nedostupan</h2>
                <p className="text-gray-500 font-medium mb-8">
                    Došlo je do greške pri povezivanju sa serverom. <br />
                    Molimo vas da proverite da li je **Backend server pokrenut** (port 8000).
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black hover:bg-blue-700 transition-all shadow-lg"
                    >
                        Pokušaj ponovo
                    </button>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="bg-gray-800 text-white px-8 py-3 rounded-xl font-black hover:bg-black transition-all shadow-lg"
                    >
                        Idi na Prijavu
                    </button>
                </div>
            </div>
        </div>
    );

    const cards = [
        {
            label: 'Ukupno Vozila',
            val: stats.total_vehicles,
            color: 'bg-blue-600',
            icon: '🚗',
            action: () => navigate('/upravljanje-vozilima')
        },
        {
            label: 'Korisnici',
            val: stats.total_users,
            color: 'bg-indigo-600',
            icon: '👥',
            action: fetchUsers
        },
        {
            label: 'Rezervacije',
            val: stats.total_reservations,
            color: 'bg-purple-600',
            icon: '📅',
            action: () => navigate('/upravljanje')
        },
        {
            label: 'Ukupan Prihod',
            val: `${stats.total_revenue} €`,
            color: 'bg-green-600',
            icon: '💰',
            action: () => setShowRevenueModal(true)
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-10">Admin Dashboard</h1>

            {/* Stats Grid - Uprošćeno */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {cards.map((item, i) => (
                    <div
                        key={i}
                        onClick={item.action}
                        className="bg-white p-6 border border-gray-200 rounded shadow-sm hover:border-blue-300 transition-colors cursor-pointer"
                    >
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <p className="text-gray-500 font-bold text-xs uppercase mb-1">{item.label}</p>
                        <p className="text-2xl font-bold text-gray-800">{item.val}</p>
                        <div className="mt-2 text-[10px] text-blue-500 font-bold">
                            DETALJI →
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Reservations Table - Uprošćeno */}
            <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Poslednje rezervacije</h2>
                    <button onClick={() => navigate('/upravljanje')} className="text-blue-600 text-xs font-bold hover:underline">Vidi sve</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-black font-bold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left">Korisnik</th>
                                <th className="px-6 py-3 text-left">Vozilo</th>
                                <th className="px-6 py-3 text-left">Period</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Iznos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {stats.latest_reservations.map(res => (
                                <tr key={res.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-gray-900">{res.korisnik?.ime}</td>
                                    <td className="px-6 py-4 text-gray-700">{res.vozilo?.marka} {res.vozilo?.model}</td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {new Date(res.vremePreuzimanja).toLocaleDateString()} - {new Date(res.vremeVracanja).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${res.status === 'OTKAZANA' ? 'bg-red-100 text-red-700' :
                                            res.status === 'ZAVRSENA' ? 'bg-green-100 text-green-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{res.ukupnaCena} €</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Users Modal - Uprošćeno */}
            {showUsersModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded p-6 max-w-xl w-full max-h-[80vh] overflow-y-auto shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Spisak Korisnika</h2>
                            <button onClick={() => setShowUsersModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="space-y-4">
                            {usersList.map(u => (
                                <div key={u.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-black">
                                            {u.ime.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{u.ime}</p>
                                            <p className="text-xs text-gray-500">{u.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-gray-100 text-gray-400">
                                        {u.uloga}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Revenue Modal - Uprošćeno */}
            {showRevenueModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded p-8 max-w-md w-full shadow-lg text-center">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Ukupan Prihod</h2>
                        <div className="text-4xl font-bold text-green-600 mb-6 py-4 border-y border-gray-100">
                            {stats.total_revenue} €
                        </div>
                        <p className="text-xs text-gray-500 mb-6">
                            Ovo je zbir svih uspešnih rezervacija.
                        </p>
                        <button
                            onClick={() => setShowRevenueModal(false)}
                            className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700"
                        >
                            Zatvori
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
