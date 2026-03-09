import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Package, FileImage, RefreshCw, XCircle } from 'lucide-react';

const MySubscriptions = () => {
    const { user } = useContext(AuthContext);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const { data } = await api.get('/subscriptions/my');
                setSubscriptions(data);
            } catch (error) {
                toast.error('Failed to fetch subscriptions');
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchSubscriptions();
    }, [user]);

    const cancelHandler = async (id) => {
        if (window.confirm('Are you sure you want to cancel this subscription?')) {
            try {
                const { data } = await api.put(`/subscriptions/${id}/cancel`);
                // Update the array with cancelled sub
                setSubscriptions(subscriptions.map(s => s._id === id ? data : s));
                toast.success('Subscription cancelled');
            } catch (error) {
                toast.error('Failed to cancel subscription');
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
                            <Link to="/profile/prescriptions" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                                <FileImage className="mr-3 h-5 w-5 text-gray-400" />
                                My Prescriptions
                            </Link>
                            <Link to="/profile/subscriptions" className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-primary-50 text-primary-700">
                                <RefreshCw className="mr-3 h-5 w-5 text-primary-500" />
                                Subscriptions
                            </Link>
                        </nav>
                    </div>
                </div>

                <div className="md:col-span-3 mt-8 md:mt-0">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <RefreshCw className="mr-2 h-6 w-6 text-primary-600" />
                        Automated Subscriptions
                    </h2>

                    {loading ? (
                        <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></div>
                    ) : subscriptions.length === 0 ? (
                        <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-100 text-gray-500">
                            You don't have any active subscriptions. Save time by automating your regular medicine refills!
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {subscriptions.map((sub) => (
                                <div key={sub._id} className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col sm:flex-row overflow-hidden">
                                    <div className="sm:w-48 bg-gray-50 p-4 border-r border-gray-100 flex justify-center items-center">
                                        <img src={sub.medicine.image} alt={sub.medicine.name} className="h-24 object-contain" />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-bold text-gray-900 truncate" title={sub.medicine.name}>{sub.medicine.name}</h3>
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${sub.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {sub.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1 mt-3">
                                                <p><span className="font-medium text-gray-800">Quantity per delivery:</span> {sub.qty}</p>
                                                <p><span className="font-medium text-gray-800">Frequency:</span> Every {sub.frequencyDays} days</p>
                                                <p><span className="font-medium text-gray-800">Estimated cost:</span> ₹{sub.medicine.price * sub.qty} (COD)</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex flex-wrap justify-between items-center border-t border-gray-100 pt-4">
                                            <div className="text-sm">
                                                <span className="text-gray-500">Next auto-delivery: </span>
                                                <span className="font-bold text-primary-600">
                                                    {sub.status === 'Active' ? new Date(sub.nextDeliveryDate).toLocaleDateString() : '—'}
                                                </span>
                                            </div>

                                            {sub.status === 'Active' && (
                                                <button
                                                    onClick={() => cancelHandler(sub._id)}
                                                    className="inline-flex items-center text-red-600 hover:text-red-800 text-sm font-medium transition-colors mt-3 sm:mt-0"
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Cancel Subscription
                                                </button>
                                            )}
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

export default MySubscriptions;
