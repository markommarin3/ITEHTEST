import React from 'react';

const Navbar = ({ user, onLogout }) => {
    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <a href="/" className="text-xl font-bold text-blue-600">AUTO RENT</a>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="/" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">Početna</a>
                        <a href="/vozila" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">Vozila</a>
                        {user && (
                            <>
                                <a href="/rezervacije" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">Rezervacije</a>
                                {user.uloga.toUpperCase() === 'KLIJENT' && (
                                    <a href="/podrska" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">Podrška</a>
                                )}
                                {(user.uloga.toUpperCase() === 'SLUZBENIK' || user.uloga.toUpperCase() === 'ADMINISTRATOR') && (
                                    <>
                                        <a href="/upravljanje" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded text-[10px] font-bold uppercase transition-all">Operativa</a>
                                        <a href="/upravljanje-vozilima" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded text-[10px] font-bold uppercase transition-all">Flota</a>
                                        <a href="/upravljanje-podrskom" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded text-[10px] font-bold uppercase transition-all">Podrška</a>
                                    </>
                                )}
                                {user.uloga.toUpperCase() === 'ADMINISTRATOR' && (
                                    <>
                                        <a href="/admin/korisnici" className="text-purple-600 hover:text-purple-800 px-3 py-2 rounded text-[10px] font-bold uppercase transition-all">Korisnici</a>
                                        <a href="/admin/logovi" className="text-purple-600 hover:text-purple-800 px-3 py-2 rounded text-[10px] font-bold uppercase transition-all">Logovi</a>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-6">
                                {user.uloga === 'ADMINISTRATOR' && (
                                    <a href="/admin" className="text-[10px] font-bold uppercase bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition-all">
                                        Admin
                                    </a>
                                )}
                                <a href="/profil" className="text-sm font-bold text-gray-900 border-b-2 border-blue-500">
                                    {user.ime}
                                </a>
                                <button
                                    onClick={onLogout}
                                    className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                                >
                                    Odjava
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <a href="/login" className="text-sm font-bold text-gray-700 hover:text-blue-600">Prijava</a>
                                <a href="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded text-sm font-bold hover:bg-blue-700 transition-all">Registracija</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
