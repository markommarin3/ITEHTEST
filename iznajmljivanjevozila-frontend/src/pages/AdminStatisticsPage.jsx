import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
    LineChart, Line
} from 'recharts';

const AdminStatisticsPage = () => {
    const categoryData = [
        { name: 'EKO', broj: 64, boja: '#3b82f6' },
        { name: 'SUV', broj: 35, boja: '#10b981' },
        { name: 'LUX', broj: 50, boja: '#f59e0b' },
        { name: 'GRADSKI', broj: 15, boja: '#ef4444' },
        { name: 'KOMBI', broj: 12, boja: '#8b5cf6' },
    ];

    const monthlyData = [
        { mesec: 'Jan', iznajmljivanja: 40 },
        { mesec: 'Feb', iznajmljivanja: 35 },
        { mesec: 'Mar', iznajmljivanja: 55 },
        { mesec: 'Apr', iznajmljivanja: 75 },
        { mesec: 'Maj', iznajmljivanja: 82 },
        { mesec: 'Jun', iznajmljivanja: 95 },
    ];

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900">Admin Statistika</h1>
                <p className="mt-2 text-gray-600">Pregled performansi flote i popularnosti vozila po kategorijama.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Popularnost po kategorijama</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    cursor={{ fill: '#f9fafb' }}
                                />
                                <Legend iconType="circle" />
                                <Bar dataKey="broj" name="Broj iznajmljivanja" radius={[6, 6, 0, 0]}>
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.boja} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Trend iznajmljivanja (6 meseci)</h2>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="mesec" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Legend iconType="circle" />
                                <Line
                                    type="monotone"
                                    dataKey="iznajmljivanja"
                                    name="Ukupno rezervacija"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Udeo kategorija u ukupnoj zaradi (%)</h2>
                    <div className="h-80 w-full flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="broj"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminStatisticsPage;
