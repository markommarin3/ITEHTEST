import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReservationEditModal from '../components/ReservationEditModal';
import { apiUrl } from '../config';

const MyReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingReservation, setEditingReservation] = useState(null);

    const fetchReservations = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Morate biti prijavljeni da biste videli rezervacije.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get(apiUrl('/api/reservations'), {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReservations(response.data.data || []);
        } catch (err) {
            console.error('Error fetching reservations:', err);
            setError('Greška prilikom učitavanja rezervacija.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Da li ste sigurni da želite da otkažete rezervaciju?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.put(apiUrl(`/api/reservations/${id}`),
                { status: 'OTKAZANA' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchReservations();
        } catch (err) {
            alert('Greška pri otkazivanju rezervacije.');
        }
    };

    if (loading) return <div className="p-8 text-center">Učitavanje rezervacija...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Moje Rezervacije</h1>

            {error ? (
                <div className="bg-red-50 text-red-700 p-4 rounded border border-red-200">{error}</div>
            ) : reservations.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Vozilo</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Period</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Lokacija</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">Cena</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-black uppercase tracking-wider">Akcije</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {reservations.map((res) => (
                                <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img
                                                src={res.vozilo?.image_url}
                                                alt={res.vozilo?.model}
                                                className="w-12 h-12 rounded object-cover mr-4 border border-gray-100"
                                            />
                                            <div>
                                                <p className="font-bold text-gray-900">{res.vozilo?.marka} {res.vozilo?.model}</p>
                                                <p className="text-xs text-gray-400">{res.vozilo?.registracioniBroj}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex flex-col">
                                            <span>Od: {new Date(res.vremePreuzimanja).toLocaleDateString()}</span>
                                            <span>Do: {new Date(res.vremeVracanja).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {res.filijala_preuzimanja?.grad}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${res.status === 'ZAVRSENA' ? 'bg-green-100 text-green-700' :
                                            res.status === 'CEKA' ? 'bg-yellow-100 text-yellow-700' :
                                                res.status === 'OTKAZANA' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                        {res.ukupnaCena} €
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {res.status === 'CEKA' && (
                                            <>
                                                <button
                                                    onClick={() => setEditingReservation(res)}
                                                    className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-wider hover:underline"
                                                >
                                                    Izmeni
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(res.id)}
                                                    className="text-red-400 hover:text-red-600 text-xs font-bold uppercase tracking-wider hover:underline"
                                                >
                                                    Otkaži
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded border border-gray-200">
                    <p className="text-gray-500 text-lg mb-6">Još uvek nemate nijednu rezervaciju.</p>
                    <Link to="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition-all">
                        Istraži vozila
                    </Link>
                </div>
            )}

            {editingReservation && (
                <ReservationEditModal
                    reservation={editingReservation}
                    onClose={() => setEditingReservation(null)}
                    onSave={() => {
                        fetchReservations();
                        setEditingReservation(null);
                    }}
                />
            )}
        </div>
    );
};

export default MyReservationsPage;
