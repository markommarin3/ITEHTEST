import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import Input from '../components/Input';
import { apiUrl } from '../config';

const VehicleDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Auth state
    const [currentUser, setCurrentUser] = useState(null);
    const [clients, setClients] = useState([]);

    // Booking states
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [selectedClientId, setSelectedClientId] = useState('');
    const [clientSearch, setClientSearch] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState('');

    // Administrative states
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            if (user.uloga === 'SLUZBENIK' || user.uloga === 'ADMINISTRATOR') {
                fetchClients();
                fetchSelectData();
            }
        }
    }, []);

    const fetchSelectData = async () => {
        try {
            // Need to fetch categories and branches for the edit form
            // Since we don't have dedicated routes yet, we'll try to get them or use common ones
            const [catRes, branchRes] = await Promise.all([
                axios.get(apiUrl('/api/stats')), // Often contains some info or we can use specific routes if they exist
            ]);
            // For now, let's assume we can get basic info or keep it simple
        } catch (err) { console.error(err); }
    };

    const fetchClients = async (searchTerm = '') => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(apiUrl(`/api/users?search=${searchTerm}`), {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Laravel-ov paginate vraća podatke u .data.data
            const allUsers = res.data.data || [];
            // Filtriramo klijente (mada backend može i to ako dodamo parametar, ali ovo je sigurnije)
            const onlyClients = allUsers.filter(u => u.uloga.toUpperCase() === 'KLIJENT');
            setClients(onlyClients);
        } catch (err) {
            console.error('Error fetching clients:', err);
        }
    };

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axios.get(apiUrl(`/api/vehicles/${id}`));
                setVehicle(response.data);
            } catch (err) {
                console.error('Error fetching vehicle details:', err);
                setError('Vozilo nije pronađeno.');
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [id]);

    const handleUpdateVehicle = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await axios.put(apiUrl(`/api/vehicles/${id}`), editedData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVehicle(res.data.vehicle);
            setIsEditing(false);
            setBookingSuccess('Podaci o vozilu su uspešno ažurirani!');
        } catch (err) {
            setError('Greška pri ažuriranju vozila.');
        }
    };

    const handleDeleteVehicle = async () => {
        if (!window.confirm('Da li ste sigurni da želite da trajno obrišete ovo vozilo?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(apiUrl(`/api/vehicles/${id}`), {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/upravljanje-vozilima');
        } catch (err) {
            setError('Greška pri brisanju vozila.');
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        setBookingLoading(true);
        setError('');
        setBookingSuccess('');

        try {
            const payload = {
                voziloId: id,
                filijalaPreuzimanjaId: vehicle.filijalaId,
                filijalaVracanjaId: vehicle.filijalaId,
                vremePreuzimanja: pickupDate,
                vremeVracanja: returnDate,
                napomene: 'Rezervacija preko web sajta'
            };

            // Ako je osoblje rezervisalo za klijenta
            if (selectedClientId) {
                payload.korisnikId = selectedClientId;
            }

            await axios.post(apiUrl('/api/reservations'), payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setBookingSuccess('Uspešno ste rezervisali vozilo! Preusmeravamo vas...');
            setTimeout(() => navigate(currentUser.uloga === 'KLIJENT' ? '/rezervacije' : '/upravljanje'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Došlo je do greške prilikom rezervacije.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="p-20 text-center font-black text-gray-400 animate-pulse text-2xl tracking-tighter uppercase transition-all">Učitavanje luksuznih detalja...</div>;
    if (error && !vehicle) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;
    if (!vehicle) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-[60%] relative">
                    <img
                        src={vehicle.image_url || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200'}
                        alt={vehicle.model}
                        className="w-full h-full object-cover min-h-[500px]"
                    />
                </div>

                {/* Content Section */}
                <div className="lg:w-[40%] p-10 lg:p-14 space-y-8 bg-white relative">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
                                {vehicle.kategorija?.naziv}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${vehicle.status === 'DOSTUPNO' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {vehicle.status}
                            </span>
                        </div>
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                {vehicle.marka} <span className="text-blue-600">{vehicle.model}</span>
                            </h1>
                            {currentUser && (currentUser.uloga === 'SLUZBENIK' || currentUser.uloga === 'ADMINISTRATOR') && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => { setIsEditing(true); setEditedData(vehicle); }}
                                        className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 hover:-translate-y-1 transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100"
                                    >
                                        Izmeni
                                    </button>
                                    <button
                                        onClick={handleDeleteVehicle}
                                        className="bg-red-500 text-white p-4 rounded-2xl hover:bg-red-600 hover:-translate-y-1 transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-red-100"
                                    >
                                        Obriši
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-600 font-bold uppercase text-[10px]">
                            Model {vehicle.godiste}. • {vehicle.registracioniBroj}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-100">
                        <div className="flex items-center space-x-4">
                            <div className="text-2xl">⛽</div>
                            <div>
                                <p className="text-[9px] text-gray-500 uppercase font-bold leading-none mb-1">Gorivo</p>
                                <p className="font-bold text-gray-800 text-sm capitalize">{vehicle.gorivo}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-2xl">⚙️</div>
                            <div>
                                <p className="text-[9px] text-gray-500 uppercase font-bold leading-none mb-1">Menjač</p>
                                <p className="font-bold text-gray-800 text-sm capitalize">{vehicle.menjac}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-2xl">👥</div>
                            <div>
                                <p className="text-[9px] text-gray-500 uppercase font-bold leading-none mb-1">Sedišta</p>
                                <p className="font-bold text-gray-800 text-sm">{vehicle.sedista} Osobe</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-2xl">📍</div>
                            <div>
                                <p className="text-[9px] text-gray-500 uppercase font-bold leading-none mb-1">Lokacija</p>
                                <p className="font-bold text-gray-800 text-sm">{vehicle.filijala?.grad}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded border border-gray-200 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase text-gray-500 leading-none mb-2">Cena po danu</p>
                            <p className="text-3xl font-bold text-gray-900">{vehicle.cenaPoDanu} €</p>
                        </div>
                        <div className="h-10 w-[1px] bg-gray-200 mx-4"></div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase text-blue-600">Osiguranje</p>
                            <p className="text-sm font-bold text-gray-800 uppercase">UKLJUČENO</p>
                        </div>
                    </div>

                    <form onSubmit={handleBooking} className="space-y-6 pt-4">
                        {currentUser && (currentUser.uloga === 'SLUZBENIK' || currentUser.uloga === 'ADMINISTRATOR') && (
                            <div className="bg-blue-600 p-6 rounded border border-blue-500 shadow-lg">
                                <label className="block text-[10px] font-bold uppercase text-white mb-4">Rezerviši za klijenta (Opciono)</label>

                                <div className="relative">
                                    <div className="flex items-center bg-white rounded px-4 py-2 border border-blue-400">
                                        <input
                                            type="text"
                                            className="w-full bg-transparent text-sm font-bold text-gray-800 outline-none placeholder:text-gray-400"
                                            placeholder="Klijent email..."
                                            value={clientSearch}
                                            onFocus={() => setDropdownOpen(true)}
                                            onChange={(e) => {
                                                setClientSearch(e.target.value);
                                                setDropdownOpen(true);
                                                fetchClients(e.target.value);
                                            }}
                                        />
                                    </div>

                                    {dropdownOpen && (
                                        <div className="absolute left-0 right-0 z-[60] mt-1 bg-white rounded border border-gray-200 shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                                            {clients.map(client => (
                                                <div
                                                    key={client.id}
                                                    onClick={() => {
                                                        setSelectedClientId(client.id);
                                                        setClientSearch(client.email);
                                                        setDropdownOpen(false);
                                                    }}
                                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                                                >
                                                    <p className="text-sm font-bold text-gray-900">{client.ime}</p>
                                                    <p className="text-[10px] text-gray-500">{client.email}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Datum preuzimanja"
                                type="datetime-local"
                                value={pickupDate}
                                onChange={(e) => setPickupDate(e.target.value)}
                                required
                            />
                            <Input
                                label="Datum vraćanja"
                                type="datetime-local"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                                required
                            />
                        </div>

                        {error && <div className="p-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 animate-shake">{error}</div>}
                        {bookingSuccess && <div className="p-4 bg-green-50 text-green-700 text-xs font-bold rounded-xl border border-green-100">{bookingSuccess}</div>}

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full h-12 text-sm font-bold uppercase"
                            disabled={bookingLoading || vehicle.status !== 'DOSTUPNO'}
                        >
                            {bookingLoading ? 'Slanje...' : vehicle.status === 'DOSTUPNO' ? 'Rezerviši' : 'Nije dostupno'}
                        </Button>
                    </form>
                </div>
            </div>

            <div className="mt-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Recenzije</h2>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* List */}
                    <div className="lg:col-span-2 space-y-6">
                        {vehicle.reviews?.length > 0 ? (
                            vehicle.reviews.map(review => (
                                <div key={review.id} className="bg-white p-6 rounded border border-gray-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center font-bold text-white uppercase">
                                                {review.korisnik?.ime?.charAt(0) || 'K'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{review.korisnik?.ime}</p>
                                                <p className="text-[9px] text-gray-500 font-bold uppercase">{new Date(review.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm italic">"{review.komentar}"</p>
                                </div>
                            ))
                        ) : (
                            <div className="bg-gray-50/50 p-20 rounded-[3rem] border-4 border-dashed border-gray-100 text-center">
                                <p className="text-4xl mb-4">✍️</p>
                                <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Budite prvi koji će oceniti {vehicle.model}</p>
                            </div>
                        )}
                    </div>

                    {/* Form */}
                    <div className="bg-white p-8 rounded border border-gray-200 shadow-sm h-fit">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Ostavite Utisak</h3>
                        <form className="space-y-6" onSubmit={async (e) => {
                            e.preventDefault();
                            const token = localStorage.getItem('token');
                            if (!token) return navigate('/login');

                            const komentar = e.target.komentar.value;
                            const ocena = e.target.rating.value;
                            const statusMsg = document.getElementById('review-status');

                            try {
                                await axios.post(apiUrl('/api/reviews'), {
                                    voziloId: id,
                                    ocena: ocena,
                                    komentar: komentar
                                }, {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                statusMsg.innerText = 'Vaš utisak je uspešno zabeležen!';
                                statusMsg.className = "p-4 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-xl mb-6 border border-green-100";
                                setTimeout(() => window.location.reload(), 1500);
                            } catch (err) {
                                statusMsg.innerText = 'Greška pri slanju. Pokušajte ponovo.';
                                statusMsg.className = "p-4 bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-widest rounded-xl mb-6 border border-red-100";
                            }
                        }}>
                            <div id="review-status"></div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Vaša Ocena</label>
                                <select name="rating" className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-black text-gray-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer">
                                    <option value="5">⭐⭐⭐⭐⭐ (Savršeno)</option>
                                    <option value="4">⭐⭐⭐⭐ (Odlično)</option>
                                    <option value="3">⭐⭐⭐ (Dobro)</option>
                                    <option value="2">⭐⭐ (Loše)</option>
                                    <option value="1">⭐ (Veoma loše)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Vaša Poruka</label>
                                <textarea
                                    name="komentar"
                                    rows="5"
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-700 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
                                    placeholder="Podelite detalje vašeg iskustva..."
                                    required
                                ></textarea>
                            </div>
                            <Button type="submit" variant="secondary" className="w-full h-14 font-black tracking-widest">
                                POŠALJI RECENZIJU
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
            {/* Edit Modal (Mobile friendly) */}
            {isEditing && (
                <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-xl flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-50">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Izmena Vozila</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ažurirajte karakteristike i podatke</p>
                        </div>

                        <form onSubmit={handleUpdateVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input label="Marka" value={editedData.marka} onChange={e => setEditedData({ ...editedData, marka: e.target.value })} />
                            <Input label="Model" value={editedData.model} onChange={e => setEditedData({ ...editedData, model: e.target.value })} />
                            <Input label="Registracija" value={editedData.registracioniBroj} onChange={e => setEditedData({ ...editedData, registracioniBroj: e.target.value })} />
                            <Input label="Godište" type="number" value={editedData.godiste} onChange={e => setEditedData({ ...editedData, godiste: e.target.value })} />
                            <Input label="Cena / Dan (€)" type="number" value={editedData.cenaPoDanu} onChange={e => setEditedData({ ...editedData, cenaPoDanu: e.target.value })} />
                            <Input label="Sedišta" type="number" value={editedData.sedista} onChange={e => setEditedData({ ...editedData, sedista: e.target.value })} />

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Gorivo</label>
                                <select
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-800 outline-none focus:border-blue-500"
                                    value={editedData.gorivo}
                                    onChange={e => setEditedData({ ...editedData, gorivo: e.target.value })}
                                >
                                    <option>Benzin</option>
                                    <option>Dizel</option>
                                    <option>Električno</option>
                                    <option>Hibrid</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Menjač</label>
                                <select
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 text-sm font-bold text-gray-800 outline-none focus:border-blue-500"
                                    value={editedData.menjac}
                                    onChange={e => setEditedData({ ...editedData, menjac: e.target.value })}
                                >
                                    <option>Manuelni</option>
                                    <option>Automatski</option>
                                </select>
                            </div>

                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <Input label="URL slike" value={editedData.image_url} onChange={e => setEditedData({ ...editedData, image_url: e.target.value })} />
                            </div>

                            <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="py-4 text-sm font-black uppercase text-gray-400 hover:text-gray-900 transition-colors"
                                >
                                    Odustani
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                                >
                                    Sačuvaj izmene
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleDetailsPage;
