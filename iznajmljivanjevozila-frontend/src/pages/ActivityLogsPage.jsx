import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../config';

const ActivityLogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        fetchLogs(1, true);
    }, []);

    const fetchLogs = async (pageNum, reset = false) => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(apiUrl(`/api/logs?page=${pageNum}`), {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newLogs = res.data.data || [];
            if (reset) {
                setLogs(newLogs);
            } else {
                setLogs(prev => [...prev, ...newLogs]);
            }

            setHasMore(res.data.next_page_url !== null);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching logs:', err);
            setLoading(false);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchLogs(nextPage);
    };

    if (loading && page === 1) return <div className="p-20 text-center font-black text-gray-300 animate-pulse text-2xl tracking-tighter">UČITAVANJE LOGOVA...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Sistemski Logovi</h1>

            <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex gap-4">
                        <div className="text-[10px] font-black uppercase text-black tracking-widest">Prikazan je istorijat svih akcija u sistemu</div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {logs.length > 0 ? logs.map((log) => (
                        <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors flex gap-6">
                            <div className="flex-grow">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-gray-900 text-sm">{log.akcija.replace(/_/g, ' ')}</h3>
                                    <span className="text-[10px] font-bold uppercase text-gray-600">
                                        {new Date(log.created_at).toLocaleString('sr-RS')}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-700 font-medium">
                                    <span className="text-gray-600">Izvršio:</span> {log.korisnik?.ime || 'Sistem'} ({log.korisnik?.email || 'N/A'})
                                </p>
                                {log.detalji && (
                                    <p className="text-xs text-gray-800 mt-2 bg-gray-50 block p-3 rounded border border-gray-100 font-bold italic">
                                        “{log.detalji}”
                                    </p>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="p-20 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                            Nema zabeleženih aktivnosti u sistemu.
                        </div>
                    )}
                </div>

                {hasMore && (
                    <div className="p-6 text-center border-t border-gray-50">
                        <button
                            onClick={loadMore}
                            className="text-[10px] font-black uppercase text-blue-600 tracking-widest hover:underline"
                        >
                            Učitaj starije zapise
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityLogsPage;
