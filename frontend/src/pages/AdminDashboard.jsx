import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Activity, Package, DollarSign } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, lowStock: 0 });
    const [loading, setLoading] = useState(true);

    // Add 30-day default range
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchStats = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                if (startDate) queryParams.append('startDate', startDate);
                if (endDate) queryParams.append('endDate', endDate);

                const { data } = await api.get(`/orders/admin/stats?${queryParams.toString()}`);
                setStats(data);
            } catch (error) {
                console.error('Failed to load stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user, navigate, startDate, endDate]);

    const chartData = {
        labels: ['Total Sales (₹)', 'Total Orders', 'Low Stock Items'],
        datasets: [
            {
                label: 'Current Metrics',
                data: [stats.totalSales, stats.totalOrders, stats.lowStock],
                backgroundColor: ['rgba(34, 197, 94, 0.5)', 'rgba(59, 130, 246, 0.5)', 'rgba(239, 68, 68, 0.5)'],
                borderColor: ['rgb(34, 197, 94)', 'rgb(59, 130, 246)', 'rgb(239, 68, 68)'],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>

                <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-sm font-medium text-gray-500">Range:</span>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="text-sm border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500 p-1"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="text-sm border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500 p-1"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">₹{stats.totalSales.toFixed(2)}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                <Activity className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                                <Package className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Alerts</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{stats.lowStock}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4">Metrics Overview</h2>
                <div className="h-96 w-full flex justify-center">
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={() => navigate('/admin/medicines')} className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 shadow-sm transition">Manage Medicines</button>
                <button onClick={() => navigate('/admin/orders')} className="bg-gray-800 text-white px-6 py-2 rounded-md hover:bg-gray-900 shadow-sm transition">Manage Orders</button>
                <button onClick={() => navigate('/admin/prescriptions')} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 shadow-sm transition">Manage Prescriptions</button>
                <button onClick={() => navigate('/admin/users')} className="bg-white text-gray-800 border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 shadow-sm transition">Manage Users</button>
            </div>
        </div>
    );
};

export default AdminDashboard;
