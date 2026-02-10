import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './Button';
import Input from './Input';
import { apiUrl } from '../config';

const ReservationEditModal = ({ reservation, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        vremePreuzimanja: '',
        vremeVracanja: '',
        voziloId: ''
    });
    const [vehicles, setVehicles] = useState([]); // DEFINISANA STANJA
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [unavailableDates, setUnavailableDates] = useState([]);

    useEffect(() => {
        if (reservation) {
            setFormData({
                // Split u slučaju da bekhend šalje format "YYYY-MM-DD HH:MM:SS"
                vremePreuzimanja: reservation.vremePreuzimanja ? reservation.vremePreuzimanja.split(' ')[0] : '',
                vremeVracanja: reservation.vremeVracanja ? reservation.vremeVracanja.split(' ')[0] : '',
                voziloId: reservation.voziloId
            });
        }
        fetchVehicles();
    }, [reservation]);

    useEffect(() => {
        if (formData.voziloId) {
            fetchUnavailableDates(formData.voziloId);
        }
    }, [formData.voziloId]);

    const fetchUnavailableDates = async (vehicleId) => {
        try {
            const res = await axios.get(apiUrl(`/api/vehicles/${vehicleId}/unavailable-dates`));
            setUnavailableDates(res.data || []);
        } catch (err) {
            console.error('Failed to fetch unavailable dates', err);
        }
    };

    const fetchVehicles = async () => {
        try {
            const res = await axios.get(apiUrl('/api/vehicles'));
            setVehicles(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch vehicles', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.put(apiUrl(`/api/reservations/${reservation.id}`),
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onSave();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Greška prilikom izmene rezervacije.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100">
                <h2 className="text-2xl font-black text-gray-900 mb-2">Izmena Rezervacije</h2>
                <p className="text-gray-500 text-sm font-bold mb-6 uppercase tracking-widest">Promena termina ili vozila</p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-bold mb-4 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Datum Preuzimanja"
                        type="date"
                        value={formData.vremePreuzimanja}
                        onChange={(e) => setFormData({ ...formData, vremePreuzimanja: e.target.value })}
                        required
                    />
                    <Input
                        label="Datum Vraćanja"
                        type="date"
                        value={formData.vremeVracanja}
                        onChange={(e) => setFormData({ ...formData, vremeVracanja: e.target.value })}
                        required
                    />

                    <div>
                        <label className="block text-xs font-black uppercase text-gray-400 mb-2">Vozilo</label>
                        <select
                            value={formData.voziloId}
                            onChange={(e) => setFormData({ ...formData, voziloId: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 text-gray-900 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:outline-none font-bold transition-all text-sm appearance-none"
                        >
                            {vehicles.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.marka} {v.model} - {v.cenaPoDanu}€/dan
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Prikaz zauzetih termina */}
                    {unavailableDates.length > 0 && (
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                            <h4 className="text-orange-800 text-xs font-black uppercase tracking-widest mb-2 flex items-center">
                                <span className="mr-2">📅</span> Zauzeti termini za ovo vozilo:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {unavailableDates.map((date, index) => (
                                    <span key={index} className="bg-white text-orange-600 px-2 py-1 rounded-md text-[10px] font-bold border border-orange-100 shadow-sm">
                                        {new Date(date.vremePreuzimanja).toLocaleDateString()} - {new Date(date.vremeVracanja).toLocaleDateString()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
                            Odustani
                        </Button>
                        <Button type="submit" variant="primary" disabled={loading} className="flex-1">
                            {loading ? 'Čuvanje...' : 'Sačuvaj Izmene'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReservationEditModal;
