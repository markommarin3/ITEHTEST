import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import Button from '../components/Button';
import { apiUrl } from '../config';

const HomePage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get(apiUrl('/api/vehicles'));
                setVehicles(response.data.data.slice(0, 3) || []);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    return (
        <div className="flex flex-col">
            {/* Hero Section - Uprošćeno */}
            <div className="bg-gray-100 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Iznajmljivanje automobila - Brzo i Lako
                    </h1>
                    <p className="text-lg text-gray-600 mb-8">
                        Pronađite najbolja vozila za vaše potrebe na našem sajtu. Sigurno i pouzdano.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition"
                            onClick={() => window.location.href = '/vozila'}
                        >
                            Pogledaj Vozila
                        </button>
                        <button
                            className="bg-gray-300 text-gray-800 px-6 py-3 rounded font-bold hover:bg-gray-400 transition"
                            onClick={() => window.location.href = '/register'}
                        >
                            Registruj se
                        </button>
                    </div>
                </div>
            </div>

            {/* Prednosti - Jednostavne kartice */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'BRZA REZERVACIJA', desc: 'Rezervišite vozilo brzo preko našeg portala.', icon: '⚡' },
                            { title: 'NIŽE CENE', desc: 'Uvek povoljne cene za sve naše korisnike.', icon: '💰' },
                            { title: 'STALNA PODRŠKA', desc: 'Tu smo za vas ako imate bilo kakva pitanja.', icon: '📞' }
                        ].map((feat, i) => (
                            <div key={i} className="border border-gray-200 p-6 rounded shadow-sm text-center">
                                <div className="text-3xl mb-4">{feat.icon}</div>
                                <h3 className="font-bold text-lg mb-2">{feat.title}</h3>
                                <p className="text-gray-600 text-sm">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured Vehicles */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Izdvajamo iz ponude</h2>
                            <p className="text-gray-600 font-medium">Pogledajte neka od naših najpopularnijih vozila.</p>
                        </div>
                        <a href="/vozila" className="text-blue-600 font-bold uppercase text-[10px] hover:underline">Sva vozila →</a>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {loading ? (
                            <p className="col-span-3 text-center text-gray-400 font-bold">Učitavanje vozila...</p>
                        ) : (
                            vehicles.map(v => (
                                <Card
                                    key={v.id}
                                    title={`${v.marka} ${v.model}`}
                                    subtitle={v.kategorija?.naziv}
                                    image={v.image_url || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'}
                                    footer={
                                        <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition" onClick={() => window.location.href = `/vozila/${v.id}`}>
                                            Rezerviši
                                        </button>
                                    }
                                >
                                    <p className="text-xl font-bold text-blue-600 mt-2">{v.cenaPoDanu} € <span className="text-[10px] text-gray-500 font-bold uppercase">/dan</span></p>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* CTA section - Standardna */}
            <div className="bg-blue-600 py-16 text-center text-white">
                <div className="max-w-xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-4">Želite da iznajmite vozilo?</h2>
                    <p className="mb-8">Napravite nalog i krenite na put već danas.</p>
                    <button
                        className="bg-white text-blue-600 px-8 py-3 rounded font-bold hover:bg-gray-100"
                        onClick={() => window.location.href = '/register'}
                    >
                        Registruj se
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
