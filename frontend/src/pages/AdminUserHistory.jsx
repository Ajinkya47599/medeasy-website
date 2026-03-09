import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, User as UserIcon, Phone, ShoppingBag, Calendar, CreditCard } from 'lucide-react';

const AdminUserHistory = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customerInfo, setCustomerInfo] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchUserOrders();
    }, [user, navigate, id]);

    const fetchUserOrders = async () => {
        try {
            const { data } = await api.get(`/orders/user/${id}`);
            setOrders(data);
            if (data.length > 0 && data[0].user) {
                // Assuming all orders are for the same user, capture user info from the first row
                setCustomerInfo(data[0].user);
            }
        } catch (error) {
            toast.error('Failed to fetch purchase history');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="flex items-center space-x-4 mb-8">
                <button onClick={() => navigate('/admin/users')} className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all">
                    <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Customer <span className="text-primary-600">Purchase History</span></h1>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-600 mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading history...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <ShoppingBag className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-xl font-bold mb-2">No purchase history found</p>
                    <p className="text-slate-500">This user hasn't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Customer Info Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex flex-shrink-0 items-center justify-center text-primary-600 shadow-inner">
                                <UserIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 mb-1">{customerInfo?.name || 'Unknown User'}</h2>
                                <div className="flex space-x-4 text-sm font-medium text-slate-500">
                                    <span className="flex items-center"><Phone className="h-4 w-4 mr-1.5 text-slate-400" /> {customerInfo?.phone || 'No phone'}</span>
                                    <span className="flex items-center text-slate-300">•</span>
                                    <span>{orders.length} Total Orders</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="bg-white shadow-sm rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center">
                                <ShoppingBag className="h-5 w-5 mr-2 text-primary-500" /> Order History
                            </h3>
                        </div>
                        <ul className="divide-y divide-slate-100">
                            {orders.map((order) => (
                                <li key={order._id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                        <div className="flex-grow">
                                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                                <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                                                    ID: {order._id.substring(0, 8)}...
                                                </span>
                                                <span className="flex items-center text-sm font-medium text-slate-500">
                                                    <Calendar className="h-4 w-4 mr-1.5" />
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                        order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>

                                            <div className="bg-white border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-50 shadow-sm">
                                                {order.orderItems.map((item, index) => (
                                                    <div key={index} className="flex items-center p-3 gap-4">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="h-12 w-12 object-cover rounded shadow-sm border border-slate-100"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</div>
                                                            <div className="text-xs font-medium text-slate-500">Qty: {item.qty} × ₹{item.price}</div>
                                                        </div>
                                                        <div className="text-sm font-bold text-slate-900">
                                                            ₹{item.qty * item.price}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="lg:w-64 flex flex-col items-start lg:items-end gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100 lg:bg-transparent lg:border-none lg:p-0">
                                            <div className="w-full lg:text-right">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Total Amount</p>
                                                <p className="text-2xl font-black text-slate-900 flex items-center lg:justify-end">
                                                    ₹{order.totalAmount.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="w-full lg:text-right">
                                                <p className="text-xs font-medium text-slate-500 flex items-center lg:justify-end">
                                                    <CreditCard className="h-3.5 w-3.5 mr-1" /> {order.paymentMethod}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUserHistory;
