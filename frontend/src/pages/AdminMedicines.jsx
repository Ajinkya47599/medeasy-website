import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminMedicines = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchMedicines();
    }, [user, navigate]);

    const fetchMedicines = async () => {
        try {
            const { data } = await api.get('/medicines');
            setMedicines(data);
        } catch (error) {
            toast.error('Failed to fetch medicines');
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this medicine?')) {
            try {
                await api.delete(`/medicines/${id}`);
                fetchMedicines();
                toast.success('Medicine deleted');
            } catch (error) {
                toast.error('Failed to delete medicine');
            }
        }
    };

    const createMedicineHandler = async () => {
        try {
            const { data } = await api.post('/medicines');
            navigate(`/admin/medicines/${data._id}/edit`);
        } catch (error) {
            toast.error('Failed to create medicine');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-primary-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900">Manage Medicines</h1>
                </div>
                <button
                    onClick={createMedicineHandler}
                    className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Medicine
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div>
            ) : (
                <div className="bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {medicines.map((med) => (
                                <tr key={med._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med._id.substring(0, 8)}...</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{med.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{med.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{med.stock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                        <button onClick={() => navigate(`/admin/medicines/${med._id}/edit`)} className="text-indigo-600 hover:text-indigo-900">
                                            <Edit className="h-5 w-5 inline" />
                                        </button>
                                        <button onClick={() => deleteHandler(med._id)} className="text-red-600 hover:text-red-900">
                                            <Trash2 className="h-5 w-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminMedicines;
