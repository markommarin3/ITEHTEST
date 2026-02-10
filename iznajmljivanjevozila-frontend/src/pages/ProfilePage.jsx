import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Input from '../components/Input';
import Button from '../components/Button';
import { apiUrl } from '../config';

const ProfilePage = () => {
    const [ime, setIme] = useState('');
    const [email, setEmail] = useState('');
    const [telefon, setTelefon] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            try {
                // Fetch Profile
                const profileRes = await axios.get(apiUrl('/api/profile'), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const user = profileRes.data;
                setIme(user.ime || '');
                setEmail(user.email || '');
                setTelefon(user.telefon || '');

                // Fetch Documents
                const docRes = await axios.get(apiUrl('/api/documents'), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDocuments(docRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('tip', 'vozacka_dozvola');

        try {
            const response = await axios.post(apiUrl('/api/documents'), formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setDocuments([...documents, response.data.document]);
            setMessage({ text: 'Dokument uspešno priložen!', type: 'success' });
            setSelectedFile(null);
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Greška pri upload-u dokumenta.';
            setMessage({ text: errorMsg, type: 'error' });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        setMessage({ text: '', type: '' });

        try {
            const response = await axios.put(apiUrl('/api/profile'), {
                ime,
                email,
                telefon
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            localStorage.setItem('user', JSON.stringify(response.data.user));
            setMessage({ text: 'Profil je uspešno ažuriran!', type: 'success' });
        } catch (err) {
            setMessage({ text: 'Greška prilikom ažuriranja profila.', type: 'error' });
        }
    };

    if (loading) return <div className="p-8 text-center text-xl">Učitavanje profila...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                {/* Sidebar Info */}
                <div className="md:w-1/3 bg-blue-600 p-10 text-white flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-blue-500 rounded flex items-center justify-center text-4xl font-bold mb-4 border-2 border-blue-400">
                        {ime.charAt(0)}
                    </div>
                    <h2 className="text-xl font-bold">{ime}</h2>
                    <p className="opacity-90 text-xs font-bold uppercase mt-1">{email}</p>
                </div>

                {/* Form Section */}
                <div className="md:w-2/3 p-10">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Podešavanja Profila</h1>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded border font-bold text-[10px] uppercase ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <Input
                            label="Ime i prezime"
                            type="text"
                            value={ime}
                            onChange={(e) => setIme(e.target.value)}
                            required
                        />
                        <Input
                            label="Email adresa"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Telefon"
                            type="text"
                            placeholder="+381 6..."
                            value={telefon}
                            onChange={(e) => setTelefon(e.target.value)}
                        />

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white h-10 rounded font-bold hover:bg-blue-700 uppercase text-xs"
                            >
                                Sačuvaj izmene
                            </button>
                        </div>

                        <div className="pt-8 border-t border-gray-100 mt-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Moja Dokumenta</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase mb-6">Priložite vozačku dozvolu.</p>

                            <div className="space-y-4 mb-6">
                                {documents.map(doc => (
                                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                                        <div className="flex items-center">
                                            <span className="text-xl mr-3">📄</span>
                                            <div>
                                                <p className="text-[9px] font-bold uppercase text-gray-600">{doc.tip.replace('_', ' ')}</p>
                                                <p className="text-xs font-bold">{doc.putanja.split('/').pop()}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded ${doc.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            doc.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {doc.status === 'APPROVED' ? 'Odobreno' : doc.status === 'REJECTED' ? 'Odbijeno' : 'Na čekanju'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="file"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all font-sans"
                                />
                                <Button
                                    onClick={handleFileUpload}
                                    disabled={!selectedFile}
                                    variant="secondary"
                                    className="shrink-0"
                                >
                                    Priloži
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
