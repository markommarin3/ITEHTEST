import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button';
import { apiUrl } from '../config';

const StaffComplaintsPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [reply, setReply] = useState('');
    const [status, setStatus] = useState('RESENA');
    const [filter, setFilter] = useState('PODNETA');

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(apiUrl('/api/complaints'), {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComplaints(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.put(apiUrl(`/api/complaints/${selectedComplaint.id}`), {
                resenje: reply,
                status: status
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedComplaint(null);
            setReply('');
            fetchComplaints();
        } catch (err) {
            alert('Greška pri slanju odgovora.');
        }
    };

    const filteredComplaints = filter === 'ALL'
        ? complaints
        : complaints.filter(c => c.status === filter);

    if (loading) return <div className="p-20 text-center font-black text-gray-400 animate-pulse text-2xl tracking-tighter uppercase transition-all">Učitavanje zahteva...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Upravljanje Podrškom</h1>
                    <p className="text-black font-bold uppercase text-[10px]">Pregled i rešavanje zahteva klijenata</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded shadow-sm">
                    {['PODNETA', 'U_OBRADI', 'RESENA', 'ALL'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded text-[10px] font-bold uppercase transition-all ${filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {f === 'ALL' ? 'Sve' : f.replace('_', ' ').replace('RESENA', 'REŠENA')}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredComplaints.map(c => (
                    <div key={c.id} className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden flex flex-col group p-6">
                        <div className="flex-grow">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${c.status === 'PODNETA' ? 'bg-yellow-50 text-yellow-600' :
                                    c.status === 'RESENA' ? 'bg-green-50 text-green-600' :
                                        'bg-blue-50 text-blue-600'
                                    }`}>
                                    {c.status}
                                </span>
                                <span className="text-[10px] text-gray-300 font-bold">#{c.id}</span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">{c.naslov}</h3>
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="text-xs font-bold text-gray-500 uppercase italic">{c.korisnik?.ime}</span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded border border-gray-100 mb-4">
                                <p className="text-gray-600 text-xs font-medium">"{c.sadrzaj}"</p>
                            </div>
                        </div>

                        <div className="mt-auto">
                            <button
                                onClick={() => setSelectedComplaint(c)}
                                className="w-full bg-blue-600 text-white py-2 rounded text-[10px] font-bold uppercase hover:bg-blue-700 transition-colors"
                            >
                                {c.resenje ? 'Izmeni Odgovor' : 'Odgovori'}
                            </button>
                        </div>
                    </div>
                ))}

                {filteredComplaints.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-gray-50/50 rounded-[4rem] border-4 border-dashed border-gray-100">
                        <p className="text-6xl mb-6 opacity-20">✅</p>
                        <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Nema zahteva u ovoj kategoriji</p>
                    </div>
                )}
            </div>

            {/* Reply Modal - Uprošćeno */}
            {selectedComplaint && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded p-8 shadow-xl border border-gray-200">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tighter">Odgovor</h2>
                            <button onClick={() => setSelectedComplaint(null)} className="text-gray-400 hover:text-gray-600 font-bold">ZATVORI</button>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-10 italic text-gray-600 text-sm">
                            "{selectedComplaint.sadrzaj}"
                        </div>

                        <form onSubmit={handleReply} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-gray-500">Status Zahteva</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm font-bold text-gray-800 outline-none"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="U_OBRADI">U Obradi</option>
                                    <option value="RESENA">Rešena / Zatvorena</option>
                                    <option value="ODBIJENA">Odbijena</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase text-gray-500">Vaš Odgovor</label>
                                <textarea
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded p-3 text-sm font-bold text-gray-800 outline-none h-40 resize-none"
                                    placeholder="Napišite rešenje..."
                                    required
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <button type="button" className="py-2 border border-gray-200 rounded text-[10px] font-bold uppercase text-gray-500 hover:bg-gray-50" onClick={() => setSelectedComplaint(null)}>ODUSTANI</button>
                                <button type="submit" className="bg-blue-600 text-white py-2 rounded text-[10px] font-bold uppercase hover:bg-blue-700">POŠALJI ODGOVOR</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffComplaintsPage;
