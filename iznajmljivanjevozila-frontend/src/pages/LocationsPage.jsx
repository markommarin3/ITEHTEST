import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationsPage = () => {

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const mapSrc = "https://maps.google.com/maps?q=Galerija+Belgrade&z=15&output=embed";

    const [rates, setRates] = useState(null);
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('EUR');
    const [toCurrency, setToCurrency] = useState('RSD');

    useEffect(() => {
        axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
            .then(res => setRates(res.data.rates))
            .catch(err => console.error("Greška pri dohvatanju kursa:", err));
    }, [fromCurrency]);

    const convertedAmount = rates
        ? (amount * rates[toCurrency]).toFixed(2)
        : 'Učitavanje...';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Informacije i Lokacije</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* mape */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Gde se nalazimo</h2>
                    <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200">
                        <iframe
                            src={mapSrc}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Mapa lokacije"
                        ></iframe>
                    </div>
                    <div className="mt-4 text-gray-600">
                        <p className="font-bold text-gray-800">Galerija Belgrade</p>
                        <p>Bulevar Vudroa Vilsona 12, Beograd</p>
                        <p>Radno vreme: 09:00 - 22:00 (Svaki dan)</p>
                    </div>
                </div>

                {/* konvertovanje */}
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Brzi Konvertor Valuta</h2>
                    <p className="text-sm text-gray-500 mb-6 text-center">Proverite cene u drugim valutama pre rezervacije.</p>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-black font-extrabold focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                                className="bg-blue-600 text-white rounded-lg p-3 font-bold border-none outline-none cursor-pointer"
                            >
                                <option value="EUR">EUR</option>
                                <option value="USD">USD</option>
                                <option value="GBP">GBP</option>
                                <option value="CHF">CHF</option>
                                <option value="JPY">JPY</option>
                                <option value="AUD">AUD</option>
                                <option value="CAD">CAD</option>
                                <option value="SEK">SEK</option>
                                <option value="NOK">NOK</option>
                                <option value="DKK">DKK</option>
                                <option value="RSD">RSD</option>
                            </select>
                        </div>

                        <div className="flex justify-center text-blue-600">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center shadow-inner">
                            <span className="text-gray-500 text-sm block mb-1">Dobijate približno:</span>
                            <span className="text-3xl font-extrabold text-black">{convertedAmount}</span>
                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                                className="ml-3 bg-gray-50 text-blue-600 font-extrabold border-none outline-none cursor-pointer hover:underline"
                            >
                                <option value="EUR">EUR</option>
                                <option value="RSD">RSD</option>
                                <option value="USD">USD</option>
                                <option value="GBP">GBP</option>
                                <option value="CHF">CHF</option>
                                <option value="JPY">JPY</option>
                                <option value="AUD">AUD</option>
                                <option value="CAD">CAD</option>
                                <option value="SEK">SEK</option>
                                <option value="NOK">NOK</option>
                                <option value="DKK">DKK</option>
                            </select>
                        </div>

                        <p className="text-[10px] text-gray-400 text-center italic">
                            *Kursne liste su informativnog karaktera (ExchangeRate-API).
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LocationsPage;
