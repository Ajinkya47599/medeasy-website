import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Package, FileImage, RefreshCw, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                toast.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchMyOrders();
    }, [user]);

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
                        <p className="text-sm font-medium text-primary-600 mt-2 capitalize">{user.role}</p>
                    </div>

                    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-2">
                        <nav className="space-y-1">
                            <Link to="/profile" className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-primary-50 text-primary-700">
                                <Package className="mr-3 h-5 w-5 text-primary-500" />
                                Order History
                            </Link>
                            <Link to="/profile/prescriptions" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                                <FileImage className="mr-3 h-5 w-5 text-gray-400" />
                                My Prescriptions
                            </Link>
                            <Link to="/profile/subscriptions" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                                <RefreshCw className="mr-3 h-5 w-5 text-gray-400" />
                                Subscriptions
                            </Link>
                            <Link to="/profile/reminders" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                                <Bell className="mr-3 h-5 w-5 text-gray-400" />
                                Medicine Reminders
                            </Link>
                        </nav>
                    </div>

                    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                        <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">Account Details</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-500">Phone:</span> {user.phone}</p>
                            <p><span className="text-gray-500">Address:</span> {user.address}</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-3 mt-8 md:mt-0">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Package className="mr-2 h-6 w-6 text-primary-600" />
                        Order History
                    </h2>

                    {loading ? (
                        <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-100 text-gray-500">
                            No orders found. Start shopping!
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center text-sm">
                                        <div>
                                            <p className="text-gray-500 mb-1">Order ID: <span className="font-bold text-gray-900">{order._id.substring(0, 8)}</span></p>
                                            <p className="text-gray-500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="mt-2 sm:mt-0 text-right">
                                            <p className="font-bold text-lg text-primary-600">₹{order.totalAmount.toFixed(2)}</p>
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mt-1
                             ${order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <ul className="divide-y divide-gray-200">
                                            {order.orderItems.map((item, index) => (
                                                <li key={index} className="py-3 flex">
                                                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-md object-cover border border-gray-200" />
                                                    <div className="ml-4 flex-1">
                                                        <p className="font-medium text-gray-900">{item.name}</p>
                                                        <p className="text-gray-500 text-sm">Qty: {item.qty} × ₹{item.price}</p>
                                                    </div>
                                                    <div className="text-right font-medium text-gray-900">
                                                        ₹{item.qty * item.price}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
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

export default Profile;
