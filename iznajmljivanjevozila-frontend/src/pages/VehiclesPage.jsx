import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import Button from '../components/Button';
import { apiUrl } from '../config';

const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get(apiUrl('/api/vehicles'));
                setVehicles(response.data.data || []);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    if (loading) return <div className="p-20 text-center font-black text-blue-600 animate-pulse">Učitavanje flote...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Naša Flota</h1>
                <p className="text-gray-600 font-medium">Istražite širok spektar vozila spremnih za vaše sledeće putovanje.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {vehicles.length > 0 ? (
                    vehicles.map((vehicle) => (
                        <Card
                            key={vehicle.id}
                            title={`${vehicle.marka} ${vehicle.model}`}
                            subtitle={vehicle.kategorija?.naziv}
                            image={vehicle.image_url || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'}
                            footer={
                                <div className="flex justify-between items-center w-full">
                                    <span className="font-bold text-xl text-blue-600">
                                        {vehicle.cenaPoDanu} € <span className="text-[10px] text-gray-500 font-bold uppercase">/ dan</span>
                                    </span>
                                    <Button variant="primary" onClick={() => (window.location.href = `/vozila/${vehicle.id}`)}>
                                        Detalji
                                    </Button>
                                </div>
                            }
                        >
                            <div className="grid grid-cols-3 gap-2 mt-4 py-4 border-t border-gray-100">
                                <div className="text-center">
                                    <p className="text-[9px] font-bold uppercase text-gray-500">Gorivo</p>
                                    <p className="text-xs font-bold text-gray-800">{vehicle.gorivo}</p>
                                </div>
                                <div className="text-center border-x border-gray-100">
                                    <p className="text-[9px] font-bold uppercase text-gray-500">Pogon</p>
                                    <p className="text-xs font-bold text-gray-800">{vehicle.menjac}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] font-bold uppercase text-gray-500">Putnici</p>
                                    <p className="text-xs font-bold text-gray-800">{vehicle.sedista}</p>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full border border-gray-200 rounded p-20 text-center bg-white">
                        <p className="text-xl font-bold text-gray-400">Trenutno nema dostupnih vozila.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehiclesPage;
