import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import Button from '../components/Button';

const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Sve');
    const [maxPrice, setMaxPrice] = useState(300);
    const [selectedFuel, setSelectedFuel] = useState('Sve');
    const [selectedSeats, setSelectedSeats] = useState('Sve');
    const [sortBy, setSortBy] = useState('default');

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await api.get('/api/vehicles');
                setVehicles(response.data.data || []);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    const categories = ['Sve', 'EKO', 'SUV', 'LUX', 'GRADSKI', 'KOMBI'];
    const fuels = ['Sve', 'Dizel', 'Benzin', 'Hibrid', 'Električno'];
    const seatsOptions = ['Sve', '2', '4', '5', '7', '8+'];

    const filteredAndSortedVehicles = useMemo(() => {
        let result = [...vehicles];

        if (searchTerm) {
            result = result.filter(v =>
                v.marka.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.model.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedCategory !== 'Sve') {
            result = result.filter(v => v.kategorija?.naziv === selectedCategory);
        }
        if (selectedFuel !== 'Sve') {
            result = result.filter(v => v.gorivo === selectedFuel);
        }
        if (selectedSeats !== 'Sve') {
            if (selectedSeats === '8+') {
                result = result.filter(v => v.sedista >= 8);
            } else {
                result = result.filter(v => v.sedista === parseInt(selectedSeats));
            }
        }
        result = result.filter(v => v.cenaPoDanu <= maxPrice);

        switch (sortBy) {
            case 'price_asc':
                result.sort((a, b) => a.cenaPoDanu - b.cenaPoDanu);
                break;
            case 'price_desc':
                result.sort((a, b) => b.cenaPoDanu - a.cenaPoDanu);
                break;
            case 'newest':
                result.sort((a, b) => b.godiste - a.godiste);
                break;
            case 'name':
                result.sort((a, b) => a.marka.localeCompare(b.marka));
                break;
            default:
                break;
        }

        return result;
    }, [vehicles, searchTerm, selectedCategory, maxPrice, selectedFuel, selectedSeats, sortBy]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 uppercase tracking-[0.2em] font-black text-gray-400">
            Učitavanje flote...
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row gap-12">

                <div className="lg:w-72 space-y-10">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 leading-none mb-2">FLOTA</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pronađite vaš idealni auto</p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Pretraga</label>
                        <input
                            type="text"
                            placeholder="BMW, Audi, Tesla..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-800 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Kategorija</label>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Maks. Cena</label>
                            <span className="text-sm font-black text-blue-600">{maxPrice} €</span>
                        </div>
                        <input
                            type="range"
                            min="20"
                            max="300"
                            step="10"
                            className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Tip Goriva</label>
                        <select
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs font-black text-gray-800 focus:ring-4 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer"
                            value={selectedFuel}
                            onChange={(e) => setSelectedFuel(e.target.value)}
                        >
                            {fuels.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Sedišta</label>
                        <div className="grid grid-cols-3 gap-2">
                            {seatsOptions.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedSeats(s)}
                                    className={`py-2 rounded-xl text-[10px] font-black border transition-all ${selectedSeats === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'}`}
                                >
                                    {s === 'Sve' ? 'SVE' : `${s}`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('Sve');
                            setMaxPrice(300);
                            setSelectedFuel('Sve');
                            setSelectedSeats('Sve');
                            setSortBy('default');
                        }}
                        className="w-full py-4 text-[9px] font-black uppercase tracking-[0.2em] text-gray-300 hover:text-red-400 transition-colors"
                    >
                        Poništi sve filtere ↑
                    </button>
                </div>

                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                        <p className="text-[10px] font-black uppercase text-gray-400">
                            Pronađeno: <span className="text-gray-900 ml-1">{filteredAndSortedVehicles.length} vozila</span>
                        </p>
                        <div className="flex items-center gap-4">
                            <label className="text-[10px] font-black uppercase text-gray-400">Sortiraj:</label>
                            <select
                                className="bg-transparent text-xs font-black text-blue-600 outline-none cursor-pointer uppercase tracking-widest"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="default">PODRAZUMEVANO</option>
                                <option value="price_asc">CENA: RASTUĆE</option>
                                <option value="price_desc">CENA: OPADAJUĆE</option>
                                <option value="newest">NAJNOVIJE</option>
                                <option value="name">NAZIV (A-Z)</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredAndSortedVehicles.length > 0 ? (
                            filteredAndSortedVehicles.map((vehicle) => (
                                <Card
                                    key={vehicle.id}
                                    title={`${vehicle.marka} ${vehicle.model}`}
                                    subtitle={vehicle.kategorija?.naziv}
                                    image={vehicle.image_url || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'}
                                    className="group hover:-translate-y-2 transition-transform duration-500 rounded-[2.5rem] overflow-hidden"
                                    footer={
                                        <div className="flex justify-between items-center w-full px-2 py-4">
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-gray-400 leading-none mb-1">Dnevno</p>
                                                <span className="font-black text-2xl text-gray-900">{vehicle.cenaPoDanu} €</span>
                                            </div>
                                            <Button
                                                variant="primary"
                                                className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl shadow-xl shadow-blue-100 group-hover:scale-110 transition-all font-black"
                                                onClick={() => (window.location.href = `/vozila/${vehicle.id}`)}
                                            >
                                                →
                                            </Button>
                                        </div>
                                    }
                                >
                                    <div className="grid grid-cols-3 gap-1 mt-6 py-6 border-t border-gray-100 bg-gray-50/50 -mx-4 -mb-4 px-4">
                                        <div className="text-center">
                                            <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Gorivo</p>
                                            <p className="text-[10px] font-black text-gray-700 uppercase">{vehicle.gorivo}</p>
                                        </div>
                                        <div className="text-center border-x border-gray-200">
                                            <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Menjač</p>
                                            <p className="text-[10px] font-black text-gray-700 uppercase">{vehicle.menjac}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[8px] font-black uppercase text-gray-400 mb-1">Mesta</p>
                                            <p className="text-[10px] font-black text-gray-700 uppercase">{vehicle.sedista}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-40 text-center bg-gray-50/50 rounded-[4rem] border-4 border-dashed border-gray-100">
                                <p className="text-5xl mb-6">🔍</p>
                                <p className="text-xl font-black text-gray-400 uppercase tracking-widest">Nema takvih vozila u ponudi</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('Sve');
                                        setMaxPrice(300);
                                        setSelectedFuel('Sve');
                                        setSelectedSeats('Sve');
                                    }}
                                    className="mt-6 text-blue-600 font-black text-[10px] uppercase hover:underline"
                                >
                                    Poništi filtere
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehiclesPage;
