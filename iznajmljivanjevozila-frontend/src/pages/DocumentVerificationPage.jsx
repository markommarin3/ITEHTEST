import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button';
import { apiUrl } from '../config';

const DocumentVerificationPage = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING');
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchDocuments();
    }, [filter]);

    const fetchDocuments = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(apiUrl(`/api/documents/all?status=${filter}`), {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDocuments(response.data);
        } catch (err) {
            console.error('Error fetching documents:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(apiUrl(`/api/documents/${id}/approve`), {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ text: 'Dokument je uspešno odobren!', type: 'success' });
            fetchDocuments();
        } catch (err) {
            setMessage({ text: 'Greška pri odobravanju dokumenta.', type: 'error' });
        }
    };

    const handleReject = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post(apiUrl(`/api/documents/${id}/reject`), {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ text: 'Dokument je odbijen.', type: 'success' });
            fetchDocuments();
        } catch (err) {
            setMessage({ text: 'Greška pri odbijanju dokumenta.', type: 'error' });
        }
    };

    if (loading) return <div className="p-8 text-center text-xl">Učitavanje dokumenata...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900 mb-4">Verifikacija Dokumenata</h1>
                <p className="text-gray-500 font-medium">Pregledajte i odobrite/odbijte dokumente korisnika</p>
            </div>

            {message.text && (
                <div className={`mb-6 p-4 rounded-xl border font-bold text-sm ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-8 border-b border-gray-200">
                {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-6 py-3 font-bold text-sm uppercase transition-all ${filter === status
                                ? 'border-b-4 border-blue-600 text-blue-600'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {status === 'PENDING' ? 'Na Čekanju' : status === 'APPROVED' ? 'Odobreni' : 'Odbijeni'}
                    </button>
                ))}
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.length > 0 ? (
                    documents.map((doc) => (
                        <div key={doc.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-3xl">📄</span>
                                <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${doc.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                        doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {doc.status}
                                </span>
                            </div>

                            <div className="mb-4">
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Korisnik</p>
                                <p className="text-lg font-bold text-gray-900">{doc.korisnik?.ime}</p>
                                <p className="text-sm text-gray-500">{doc.korisnik?.email}</p>
                            </div>

                            <div className="mb-4">
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Tip Dokumenta</p>
                                <p className="text-sm font-semibold text-gray-700">{doc.tip.replace('_', ' ')}</p>
                            </div>

                            <div className="mb-4">
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Fajl</p>
                                <a
                                    href={apiUrl(doc.putanja)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold underline"
                                >
                                    {doc.naziv}
                                </a>
                            </div>

                            {doc.status === 'PENDING' && (
                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                    <Button
                                        variant="primary"
                                        onClick={() => handleApprove(doc.id)}
                                        className="flex-1"
                                    >
                                        ✓ Odobri
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleReject(doc.id)}
                                        className="flex-1 bg-red-50 text-red-600 hover:bg-red-100"
                                    >
                                        ✗ Odbij
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-20">
                        <p className="text-2xl font-black text-gray-300">Nema dokumenata za prikaz</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentVerificationPage;
