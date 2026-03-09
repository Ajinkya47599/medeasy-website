import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FileImage, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

const AdminPrescriptions = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchPrescriptions();
    }, [user, navigate]);

    const fetchPrescriptions = async () => {
        try {
            const { data } = await api.get('/users/prescriptions/admin');
            setPrescriptions(data);
        } catch (error) {
            toast.error('Failed to fetch prescriptions');
        } finally {
            setLoading(false);
        }
    };

    const statusUpdateHandler = async (userId, prescId, newStatus) => {
        let rejectionReason = '';
        if (newStatus === 'Rejected') {
            rejectionReason = window.prompt("Please provide a reason for rejecting this prescription:");
            if (rejectionReason === null) return; // User cancelled the prompt
        }

        try {
            await api.put(`/users/prescriptions/admin/${userId}/${prescId}`, { status: newStatus, rejectionReason });
            toast.success(`Prescription ${newStatus}`);
            // Update local state without refetching to be snappy
            setPrescriptions(prev => prev.map(p => p._id === prescId ? { ...p, status: newStatus } : p));
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center space-x-4 mb-8">
                <button onClick={() => navigate('/admin')} className="text-gray-500 hover:text-primary-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                    <FileImage className="h-8 w-8 text-primary-600" />
                    Review Prescriptions
                </h1>
            </div>

            {loading ? (
                <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div>
            ) : prescriptions.length === 0 ? (
                <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-100 text-gray-500">
                    No prescriptions have been uploaded by users yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prescriptions.map((p) => (
                        <div key={p._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                            <div className="h-48 relative border-b border-gray-100 group">
                                <img src={`http://localhost:5000${p.imageUrl}`} alt={p.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                    <a href={`http://localhost:5000${p.imageUrl}`} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-all hover:bg-gray-50">
                                        View Full <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                                <div className="absolute top-2 right-2">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border
                                        ${p.status === 'Verified' ? 'bg-green-50 text-green-700 border-green-200' :
                                            p.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                        {p.status}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1 truncate" title={p.userName}>{p.userName}</h3>
                                    <p className="text-sm text-gray-600 mb-1">📞 {p.userPhone}</p>
                                    <p className="text-xs text-gray-500 mb-4 line-clamp-2" title={p.userAddress}>📍 {p.userAddress}</p>

                                    <div className="bg-gray-50 p-3 rounded text-sm border border-gray-100 mb-4">
                                        <p><span className="font-medium text-gray-700">File Name:</span> {p.name}</p>
                                        <p><span className="font-medium text-gray-700">Uploaded:</span> {new Date(p.uploadedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <button
                                        onClick={() => statusUpdateHandler(p.userId, p._id, 'Verified')}
                                        disabled={p.status === 'Verified'}
                                        className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 border rounded-md text-sm font-medium transition-colors
                                            ${p.status === 'Verified' ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-green-700 border-green-300 hover:bg-green-50'}`}
                                    >
                                        <CheckCircle className="h-4 w-4" /> Approve
                                    </button>
                                    <button
                                        onClick={() => statusUpdateHandler(p.userId, p._id, 'Rejected')}
                                        disabled={p.status === 'Rejected'}
                                        className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 border rounded-md text-sm font-medium transition-colors
                                            ${p.status === 'Rejected' ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-red-700 border-red-300 hover:bg-red-50'}`}
                                    >
                                        <XCircle className="h-4 w-4" /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPrescriptions;
