import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button';
import { apiUrl } from '../config';

const ComplaintsPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [naslov, setNaslov] = useState('');
    const [sadrzaj, setSadrzaj] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post(apiUrl('/api/complaints'), {
                naslov,
                sadrzaj
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Vaša reklamacija je uspešno poslata.');
            setNaslov('');
            setSadrzaj('');
            fetchComplaints();
        } catch (err) {
            setMessage('Greška pri slanju.');
        }
    };

    if (loading) return <div className="p-20 text-center font-black text-gray-400 animate-pulse text-2xl tracking-tighter uppercase transition-all">Učitavanje podrške...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20">
            <div className="text-center mb-16">
                <h1 className="text-6xl font-black text-gray-900 mb-4 tracking-tighter">Centar za <span className="text-blue-600">Podršku</span></h1>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em]">Brzo i efikasno rešavanje vaših zahteva</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-16">
                {/* Form Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 sticky top-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-gray-900 mb-2">Nova Podrška</h2>
                            <p className="text-xs text-gray-400 font-medium">Opišite nam kako vam možemo pomoći</p>
                        </div>

                        {message && (
                            <div className="mb-8 p-4 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-blue-100 flex items-center">
                                <span className="mr-3 text-lg">✨</span> {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Naslov</label>
                                <input
                                    type="text"
                                    value={naslov}
                                    onChange={(e) => setNaslov(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] p-5 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner"
                                    placeholder="Npr. Problem sa rezervacijom"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-widest">Detaljan Opis</label>
                                <textarea
                                    value={sadrzaj}
                                    onChange={(e) => setSadrzaj(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] p-5 text-sm font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner h-48 resize-none"
                                    placeholder="Navedite sve detalje kako bismo lakše rešili problem..."
                                    required
                                ></textarea>
                            </div>
                            <Button type="submit" variant="primary" className="w-full h-16 shadow-2xl shadow-blue-200">POŠALJI ZAHTEV</Button>
                        </form>
                    </div>
                </div>

                {/* History Section */}
                <div className="lg:col-span-3 space-y-10">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Vaši Zahtevi</h2>
                        <span className="bg-gray-100 px-4 py-1.5 rounded-full text-[10px] font-black text-gray-500 uppercase">{complaints.length} ukupno</span>
                    </div>

                    {complaints.length > 0 ? (
                        <div className="space-y-6">
                            {complaints.map(c => (
                                <div key={c.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                                    <div className="p-10">
                                        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                                            <div className="flex items-center space-x-3">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${c.status === 'PODNETA' ? 'bg-yellow-50 text-yellow-600' :
                                                        c.status === 'RESENA' ? 'bg-green-50 text-green-600' :
                                                            'bg-blue-50 text-blue-600'
                                                    }`}>
                                                    {c.status.replace('RESENA', 'REŠENA')}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                                    {new Date(c.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <span className="text-gray-300 font-black text-xs">#{c.id}</span>
                                        </div>

                                        <h3 className="text-xl font-black text-gray-900 mb-4">{c.naslov}</h3>
                                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-50 mt-4 mb-8">
                                            <p className="text-gray-600 text-sm leading-relaxed font-medium">"{c.sadrzaj}"</p>
                                        </div>

                                        {c.resenje && (
                                            <div className="bg-blue-600 p-8 rounded-[2rem] text-white relative mt-10 animate-in slide-in-from-bottom-4 duration-500">
                                                <div className="absolute -top-3 left-10 bg-white text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                    ODGOVOR TIMA
                                                </div>
                                                <p className="text-sm font-bold opacity-95 leading-relaxed">
                                                    {c.resenje}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50/50 p-20 rounded-[4rem] border-4 border-dashed border-gray-100 text-center">
                            <p className="text-5xl mb-6 opacity-30">✉️</p>
                            <p className="text-gray-400 font-black uppercase text-xs tracking-[0.2em]">Nemate aktivnih niti arhiviranih reklamacija</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplaintsPage;
