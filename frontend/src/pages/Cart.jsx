import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart, addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const hasPrescriptionMed = cart.some((item) => item.requiresPrescription);

    const handleCheckout = () => {
        if (!user) {
            navigate('/login?redirect=checkout');
        } else {
            navigate('/checkout');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-10 rounded-xl shadow-sm text-center border border-gray-100 max-w-md w-full">
                    <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8">Add some medicines to your cart to proceed.</p>
                    <Link
                        to="/medicines"
                        className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                        Browse Medicines
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item) => (
                        <div key={item.medicine} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-gray-50" />
                            <div className="flex-1">
                                <Link to={`/medicines/${item.medicine}`} className="text-lg font-bold text-gray-900 hover:text-primary-600">
                                    {item.name}
                                </Link>
                                <p className="text-primary-600 font-bold mt-1">₹{item.price}</p>
                                {item.requiresPrescription && (
                                    <span className="inline-block mt-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded border border-red-200">
                                        Prescription Required
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4">
                                <select
                                    value={item.qty}
                                    onChange={(e) => addToCart({ _id: item.medicine, ...item }, Number(e.target.value))}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5"
                                >
                                    {[...Array(10).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                            {x + 1}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => removeFromCart(item.medicine)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({cart.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                                <span className="font-medium text-gray-900">₹{totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Charge</span>
                                <span className="font-medium text-green-600">Free</span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-lg font-bold text-primary-600">₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {hasPrescriptionMed && (
                            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <p className="text-sm text-blue-800">
                                    <span className="font-bold">Note:</span> Your cart contains medicines that require a prescription. You will be asked to upload it during checkout.
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleCheckout}
                            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm transition-colors"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
