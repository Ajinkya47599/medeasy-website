import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Package, FileImage, RefreshCw, Heart, ShoppingCart } from 'lucide-react';

const MyWishlist = () => {
    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        try {
            const { data } = await api.get('/users/wishlist');
            setWishlist(data);
        } catch (error) {
            toast.error('Failed to fetch wishlist');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchWishlist();
        }
    }, [user, navigate]);

    const removeFromWishlist = async (id) => {
        try {
            await api.post('/users/wishlist', { medicineId: id });
            setWishlist(wishlist.filter(item => item._id !== id));
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error('Failed to update wishlist');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:grid md:grid-cols-4 md:gap-8">
                {/* Sidebar */}
                <div className="md:col-span-1 border-r border-gray-200 pr-4">
                    <div className="text-center py-6 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="inline-flex justify-center items-center h-20 w-20 rounded-full bg-primary-100 mb-4">
                            <User className="h-10 w-10 text-primary-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 truncate">{user?.name}</h2>
                        <p className="text-sm text-gray-500 mt-1 truncate">{user?.email}</p>
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
                            <Link to="/profile/subscriptions" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                                <RefreshCw className="mr-3 h-5 w-5 text-gray-400" />
                                Subscriptions
                            </Link>
                            <Link to="/profile/wishlist" className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-primary-50 text-primary-700">
                                <Heart className="mr-3 h-5 w-5 text-primary-500" />
                                Wishlist
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-3 mt-8 md:mt-0">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Heart className="mr-2 h-6 w-6 text-primary-600 fill-primary-600" />
                        My Favorites
                    </h2>

                    {loading ? (
                        <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></div>
                    ) : wishlist.length === 0 ? (
                        <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-100 text-gray-500">
                            Your wishlist is empty. Browse medicines and add them to your favorites!
                            <div className="mt-4">
                                <Link to="/medicines" className="text-primary-600 font-medium hover:underline">Explore Medicines</Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlist.map((med) => (
                                <div key={med._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm relative group">
                                    <button
                                        onClick={() => removeFromWishlist(med._id)}
                                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors z-10"
                                        title="Remove from favorites"
                                    >
                                        <Heart className="h-5 w-5 fill-current" />
                                    </button>

                                    <div className="h-40 bg-gray-50 flex items-center justify-center p-4">
                                        <Link to={`/medicine/${med._id}`}>
                                            <img src={med.image} alt={med.name} className="max-h-32 object-contain group-hover:scale-105 transition-transform duration-300" />
                                        </Link>
                                    </div>
                                    <div className="p-4 border-t border-gray-100">
                                        <Link to={`/medicine/${med._id}`}>
                                            <h3 className="text-md font-bold text-gray-900 truncate hover:text-primary-600" title={med.name}>{med.name}</h3>
                                        </Link>
                                        <p className="text-xs text-gray-500 mt-1">{med.category}</p>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-lg font-extrabold text-primary-600">₹{med.price}</span>
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${med.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {med.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                addToCart(med, 1);
                                                toast.success('Added to cart');
                                            }}
                                            disabled={med.stock === 0}
                                            className="w-full mt-4 bg-gray-900 text-white py-2 flex items-center justify-center rounded-md text-sm font-medium hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                            Add to Cart
                                        </button>
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

export default MyWishlist;
