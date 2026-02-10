import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button';
import Input from '../components/Input';
import { apiUrl } from '../config';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        ime: '',
        email: '',
        uloga: 'KLIJENT',
        filijalaId: '',
        telefon: '',
        sifra: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchBranches();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(apiUrl('/api/users'), {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get(apiUrl('/api/branches'), {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBranches(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                ime: user.ime,
                email: user.email,
                uloga: user.uloga,
                filijalaId: user.filijalaId || '',
                telefon: user.telefon || '',
                sifra: '' // Passwords are not fetched
            });
        } else {
            setEditingUser(null);
            setFormData({
                ime: '',
                email: '',
                uloga: 'KLIJENT',
                filijalaId: '',
                telefon: '',
                sifra: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const payload = { ...formData };

            // Remove empty password field when editing
            if (!payload.sifra && editingUser) {
                delete payload.sifra;
            }

            // Remove filijalaId if not SLUZBENIK
            if (payload.uloga !== 'SLUZBENIK') {
                payload.filijalaId = null;
            }

            if (editingUser) {
                const response = await axios.put(apiUrl(`/api/users/${editingUser.id}`), payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Update response:', response.data);
            } else {
                const response = await axios.post(apiUrl('/api/users'), payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Create response:', response.data);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (err) {
            console.error('Error details:', err.response?.data);
            const errorMessage = err.response?.data?.message || 'Greška pri čuvanju korisnika. Proverite podatke.';
            const errors = err.response?.data?.errors;

            if (errors) {
                const errorList = Object.values(errors).flat().join('\n');
                alert(`${errorMessage}\n\n${errorList}`);
            } else {
                alert(errorMessage);
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Da li ste sigurni da želite da deaktivirate ovog korisnika?')) return;
        const token = localStorage.getItem('token');
        try {
            const response = await axios.delete(apiUrl(`/api/users/${id}`), {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Delete response:', response.data);
            alert(response.data.message || 'Korisnik uspešno deaktiviran');
            fetchUsers();
        } catch (err) {
            console.error('Delete error:', err.response?.data);
            const errorMessage = err.response?.data?.message || 'Greška pri brisanju.';
            alert(errorMessage);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.ime.toLowerCase().includes(filter.toLowerCase()) || u.email.toLowerCase().includes(filter.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || u.uloga === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) return <div className="p-20 text-center animate-pulse text-2xl font-black text-gray-300">Učitavanje korisnika...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Upravljanje Korisnicima</h1>
                    <p className="text-black font-bold uppercase text-[10px]">Pregled i administracija nivoa pristupa</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="shadow-sm border border-gray-200">
                    + Novi Korisnik
                </Button>
            </div>

            {/* Filters - Uprošćeno */}
            <div className="bg-white p-4 rounded border border-gray-200 shadow-sm mb-8 flex flex-wrap gap-4 items-center">
                <div className="flex-grow">
                    <Input
                        placeholder="Pretraga po imenu ili email-u..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-gray-50"
                    />
                </div>
                <div className="flex bg-gray-100 p-1 rounded">
                    {['ALL', 'KLIJENT', 'SLUZBENIK', 'ADMINISTRATOR'].map(role => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${roleFilter === role ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {role === 'ALL' ? 'Svi' : role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users List - Kartice */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map(u => (
                    <div key={u.id} className="bg-white p-6 rounded border border-gray-200 shadow-sm hover:border-blue-200 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded flex items-center justify-center text-lg font-bold ${u.uloga === 'ADMINISTRATOR' ? 'bg-purple-100 text-purple-600' :
                                u.uloga === 'SLUZBENIK' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {u.ime.charAt(0)}
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${u.uloga === 'ADMINISTRATOR' ? 'bg-purple-50 text-purple-600' :
                                u.uloga === 'SLUZBENIK' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                                }`}>
                                {u.uloga}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-1">{u.ime}</h3>
                        <p className="text-gray-500 text-xs font-medium mb-4">{u.email}</p>

                        <div className="space-y-1 mb-6">
                            <div className="flex items-center text-xs text-black">
                                <span className="w-5">📱</span> {u.telefon || 'Nema telf.'}
                            </div>
                            {u.filijalaId && (
                                <div className="flex items-center text-xs text-black">
                                    <span className="w-5">🏢</span> Filijala #{u.filijalaId}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-gray-100">
                            <button onClick={() => handleOpenModal(u)} className="flex-1 py-1.5 bg-gray-50 text-blue-600 rounded text-[10px] font-bold uppercase border border-blue-100 hover:bg-blue-50">
                                Izmeni
                            </button>
                            <button onClick={() => handleDelete(u.id)} className="flex-1 py-1.5 bg-gray-50 text-red-600 rounded text-[10px] font-bold uppercase border border-red-100 hover:bg-red-50">
                                Deaktiviraj
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal - Uprošćeno */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">{editingUser ? 'Izmena Korisnika' : 'Novi Korisnik'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input label="Ime i Prezime" value={formData.ime} onChange={e => setFormData({ ...formData, ime: e.target.value })} required />
                            <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            <Input label="Telefon" value={formData.telefon} onChange={e => setFormData({ ...formData, telefon: e.target.value })} />

                            {!editingUser && (
                                <Input label="Lozinka" type="password" value={formData.sifra} onChange={e => setFormData({ ...formData, sifra: e.target.value })} required />
                            )}
                            {editingUser && (
                                <Input label="Nova Lozinka (opciono)" type="password" value={formData.sifra} onChange={e => setFormData({ ...formData, sifra: e.target.value })} placeholder="Ostavite prazno ako ne menjate" />
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Uloga</label>
                                <select
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.uloga}
                                    onChange={e => setFormData({ ...formData, uloga: e.target.value })}
                                >
                                    <option value="KLIJENT">Klijent</option>
                                    <option value="SLUZBENIK">Službenik</option>
                                    <option value="ADMINISTRATOR">Administrator</option>
                                </select>
                            </div>

                            {formData.uloga === 'SLUZBENIK' && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Filijala</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.filijalaId}
                                        onChange={e => setFormData({ ...formData, filijalaId: e.target.value })}
                                        required={formData.uloga === 'SLUZBENIK'}
                                    >
                                        <option value="">Izaberite filijalu...</option>
                                        {branches.map(b => (
                                            <option key={b.id} value={b.id}>{b.ime} ({b.grad})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Odustani</Button>
                                <Button type="submit" className="flex-1">Sačuvaj</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagementPage;
