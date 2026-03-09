import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, FileImage, Trash2, Package } from 'lucide-react';

const MyPrescriptions = () => {
    const { user } = useContext(AuthContext);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const { data } = await api.get('/users/prescriptions');
                setPrescriptions(data);
            } catch (error) {
                toast.error('Failed to fetch prescriptions');
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchPrescriptions();
    }, [user]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const { data: imageUrl } = await api.post('/upload', formData);

            // Now save to user's wallet
            const { data: updatedPrescriptions } = await api.post('/users/prescriptions', {
                imageUrl,
                name: file.name
            });

            setPrescriptions(updatedPrescriptions);
            toast.success('Prescription added to wallet');
        } catch (error) {
            console.error('UPLOAD CRASH:', error.response || error);
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this prescription?')) {
            try {
                const { data } = await api.delete(`/users/prescriptions/${id}`);
                setPrescriptions(data);
                toast.success('Prescription deleted');
            } catch (error) {
                toast.error('Failed to delete prescription');
            }
        }
    };

    if (!user) return <div className="p-8 text-center text-xl">Please Login First</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:grid md:grid-cols-4 md:gap-8">
                <div className="md:col-span-1 border-r border-gray-200 pr-4">
                    <div className="text-center py-6 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="inline-flex justify-center items-center h-20 w-20 rounded-full bg-primary-100 mb-4">
                            <User className="h-10 w-10 text-primary-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 truncate">{user.name}</h2>
                        <p className="text-sm text-gray-500 mt-1 truncate">{user.email}</p>
                    </div>

                    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-2">
                        <nav className="space-y-1">
                            <Link to="/profile" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                                <Package className="mr-3 h-5 w-5 text-gray-400" />
                                Order History
                            </Link>
                            <Link to="/profile/prescriptions" className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-primary-50 text-primary-700">
                                <FileImage className="mr-3 h-5 w-5 text-primary-500" />
                                My Prescriptions
                            </Link>
                        </nav>
                    </div>
                </div>

                <div className="md:col-span-3 mt-8 md:mt-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <FileImage className="mr-2 h-6 w-6 text-primary-600" />
                            Prescription Wallet
                        </h2>

                        <div>
                            <label className="cursor-pointer bg-primary-600 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                {uploading ? 'Uploading...' : 'Upload New'}
                                <input type="file" className="sr-only" onChange={uploadFileHandler} disabled={uploading} />
                            </label>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></div>
                    ) : prescriptions.length === 0 ? (
                        <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-100 text-gray-500">
                            Your wallet is empty. Upload a prescription for faster checkout later!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {prescriptions.map((p) => (
                                <div key={p._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                                    <div className="h-48 bg-gray-100 relative">
                                        <img src={`http://localhost:5000${p.imageUrl}`} alt={p.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${p.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {p.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 truncate" title={p.name}>{p.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">Uploaded: {new Date(p.uploadedAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={() => deleteHandler(p._id)}
                                                className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-full transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyPrescriptions;
