import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pill, ShoppingCart, User, LogOut, Heart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="glass fixed w-full z-50 top-0 left-0 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <Pill className="h-8 w-8 text-primary-600 transition-transform group-hover:rotate-12 group-hover:scale-110 duration-300" />
                        <span className="font-bold text-2xl text-gray-900 tracking-tight">MedEasy</span>
                    </Link>

                    <div className="hidden md:flex space-x-8 items-center">
                        <Link to="/medicines" className="text-gray-600 hover:text-primary-600 font-semibold tracking-wide transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 hover:after:w-full after:transition-all after:duration-300">
                            Medicines
                        </Link>
                        {user && user.role === 'admin' && (
                            <Link to="/admin" className="text-gray-600 hover:text-primary-600 font-semibold tracking-wide transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 hover:after:w-full after:transition-all after:duration-300">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center space-x-5">
                        {user && (
                            <Link to="/profile/wishlist" className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300" title="My Wishlist">
                                <Heart className="h-6 w-6 hover:fill-current transition-all" />
                            </Link>
                        )}
                        <Link to="/cart" className="relative p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all duration-300">
                            <ShoppingCart className="h-6 w-6" />
                            {cart.length > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full animate-bounce">
                                    {cart.reduce((acc, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-4 border-l pl-5 border-gray-200">
                                <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                                    <div className="bg-primary-100 p-1.5 rounded-full">
                                        <User className="h-5 w-5 text-primary-600" />
                                    </div>
                                    <span className="hidden sm:inline-block font-semibold">{user.name}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-300"
                                    title="Logout"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex space-x-3 border-l pl-5 border-gray-200">
                                <Link to="/login" className="px-5 py-2.5 text-primary-700 font-semibold hover:bg-primary-50 rounded-lg transition-all duration-300">
                                    Login
                                </Link>
                                <Link to="/register" className="px-5 py-2.5 bg-primary-600 text-white font-semibold hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 rounded-lg transition-all duration-300">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
