import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/Input';
import Button from '../components/Button';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        ime: '',
        email: '',
        sifra: '',
        sifra_confirmation: '',
        telefon: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.sifra !== formData.sifra_confirmation) {
            setError('Lozinke se ne podudaraju.');
            return;
        }

        setLoading(true);

        try {
            await api.post('/api/register', formData);
            navigate('/login', { state: { message: 'Uspešno ste se registrovali! Prijavite se.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Greška prilikom registracije. Proverite podatke.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-4">
            <div className="max-w-4xl w-full bg-white rounded border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">

                {/* Info Sekcija */}
                <div className="md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-6">PRIDRUŽI SE</h2>
                    <p className="text-blue-100 font-medium mb-8">
                        Registracijom dobijate pristup vozilima i bržem procesu rezervacije.
                    </p>
                    <div className="space-y-4 text-sm font-bold uppercase">
                        <div className="flex items-center space-x-3">
                            <span>🚗 Preko 50 vozila</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span>🛡️ Osiguranje uključeno</span>
                        </div>
                    </div>
                </div>

                {/* Forma za registraciju */}
                <div className="md:w-1/2 p-10">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900">Napravi Nalog</h3>
                        <p className="text-gray-500 font-bold uppercase text-[10px]">Započni svoje putovanje danas</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleRegister}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-[10px] font-bold uppercase">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Puno Ime"
                            name="ime"
                            type="text"
                            placeholder="Zoran Petrović"
                            value={formData.ime}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Email Adresa"
                            name="email"
                            type="email"
                            placeholder="zoran@mail.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Broj Telefona"
                            name="telefon"
                            type="tel"
                            placeholder="+381 6..."
                            value={formData.telefon}
                            onChange={handleChange}
                            required
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Lozinka"
                                name="sifra"
                                type="password"
                                placeholder="Najmanje 8 karaktera"
                                value={formData.sifra}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Potvrdi Lozinku"
                                name="sifra_confirmation"
                                type="password"
                                placeholder="Ponovite lozinku"
                                value={formData.sifra_confirmation}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white h-12 rounded font-bold hover:bg-blue-700 uppercase text-xs"
                                disabled={loading}
                            >
                                {loading ? 'Kreiranje...' : 'Registruj se'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-xs">
                        <p className="text-gray-500 font-medium">
                            Već imaš nalog?{' '}
                            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 underline">
                                Prijavi se
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
