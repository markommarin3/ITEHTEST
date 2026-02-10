import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { apiUrl } from '../config';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Poruka uspeha ako dolazimo sa registracije
    const successMsg = location.state?.message;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(apiUrl('/api/login'), {
                email,
                sifra: password,
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data?.message || 'Neispravni podaci za prijavu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-20 px-4">
            <div className="max-w-4xl w-full bg-white rounded border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row-reverse">

                {/* Info Side */}
                <div className="md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-4">DOBRODOŠLI NAZAD</h2>
                    <p className="text-blue-100 font-medium mb-8">
                        Prijavite se i nastavite tamo gde ste stali.
                    </p>
                    <div className="p-4 bg-blue-500 rounded border border-blue-400">
                        <p className="text-xs italic">"Najbolji servis za iznajmljivanje u regionu."</p>
                        <p className="mt-2 font-bold text-[10px] uppercase text-blue-200">- KLIJENT</p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="md:w-1/2 p-10">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-900">Prijavi se</h3>
                        <p className="text-gray-500 font-bold uppercase text-[10px]">Pristupite svom panelu</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        {successMsg && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-[10px] font-bold uppercase">
                                {successMsg}
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-[10px] font-bold uppercase">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Email Adresa"
                            type="email"
                            placeholder="vas@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Lozinka"
                            type="password"
                            placeholder="Vaša tajna šifra"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white h-12 rounded font-bold hover:bg-blue-700 uppercase text-xs"
                                disabled={loading}
                            >
                                {loading ? 'Prijava...' : 'Prijavi se'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-xs">
                        <p className="text-gray-500 font-medium">
                            Nemaš nalog?{' '}
                            <a href="/register" className="font-bold text-blue-600 hover:text-blue-700 underline">
                                Registruj se
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
