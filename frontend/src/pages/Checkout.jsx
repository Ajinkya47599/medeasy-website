import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FileImage, CreditCard, Banknote } from 'lucide-react';

const Checkout = () => {
    const { cart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState(user?.address || '');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [prescriptionImage, setPrescriptionImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [savedPrescriptions, setSavedPrescriptions] = useState([]);

    const totalAmount = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const hasPrescriptionMed = cart.some((item) => item.requiresPrescription);

    useEffect(() => {
        if (!user) {
            navigate('/login?redirect=checkout');
        } else {
            const fetchPrescriptions = async () => {
                try {
                    const { data } = await api.get('/users/prescriptions');
                    setSavedPrescriptions(data.filter(p => p.status === 'Verified'));
                } catch (error) {
                    console.error('Failed to fetch prescriptions', error);
                }
            };
            fetchPrescriptions();
        }
        if (cart.length === 0) {
            navigate('/cart');
        }
    }, [user, cart, navigate]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const { data } = await api.post('/upload', formData);
            setPrescriptionImage(data);
            setUploading(false);
            toast.success('Prescription uploaded successfully');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Image upload failed');
        }
    };

    const placeOrderHandler = async (e) => {
        e.preventDefault();
        if (hasPrescriptionMed && !prescriptionImage) {
            return toast.error('Please upload prescription for required medicines');
        }

        try {
            const { data: dbOrder } = await api.post('/orders', {
                orderItems: cart,
                deliveryAddress: { address, city, postalCode, country: 'India' },
                paymentMethod,
                totalAmount,
                prescriptionImage,
            });

            if (paymentMethod === 'Cash on Delivery') {
                clearCart();
                toast.success('Order placed successfully!');
                navigate(`/profile`);
                return;
            }

            // Razorpay Payment Flow
            const { data: rzpOrder } = await api.post('/payments/create-order', {
                amount: totalAmount
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SMj9QMSSoVhJQn',
                amount: rzpOrder.amount,
                currency: "INR",
                name: "MedEasy Pharmacy",
                description: "Health & Medicine Order",
                order_id: rzpOrder.id,
                handler: async function (response) {
                    try {
                        await api.post('/payments/verify', {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: dbOrder._id
                        });
                        clearCart();
                        toast.success('Payment successful! Order confirmed.');
                        navigate('/profile');
                    } catch (error) {
                        toast.error('Payment verification failed.');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone
                },
                theme: {
                    color: "#16a34a"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                toast.error('Payment failed. ' + response.error.description);
            });
            rzp.open();

        } catch (error) {
            toast.error(error.response?.data?.message || 'Order failed');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:grid md:grid-cols-3 md:gap-8">
                <div className="md:col-span-2">
                    <form onSubmit={placeOrderHandler} className="space-y-6">
                        <div className="bg-white px-4 py-5 shadow-sm sm:rounded-lg border border-gray-100 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Delivery Address</h3>
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6">
                                    <label className="block text-sm font-medium text-gray-700">Street Address</label>
                                    <input
                                        type="text"
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input
                                        type="text"
                                        required
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                    <input
                                        type="text"
                                        required
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {hasPrescriptionMed && (
                            <div className="bg-white px-4 py-5 shadow-sm sm:rounded-lg border border-gray-100 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Provide Prescription</h3>

                                {savedPrescriptions.length > 0 && (
                                    <div className="mb-6">
                                        <p className="text-sm font-medium text-gray-700 mb-3">Select from Wallet</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {savedPrescriptions.map(p => (
                                                <div
                                                    key={p._id}
                                                    onClick={() => setPrescriptionImage(p.imageUrl)}
                                                    className={`cursor-pointer border-2 rounded-lg p-2 transition-all ${prescriptionImage === p.imageUrl ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-500 ring-offset-1' : 'border-gray-200 hover:border-primary-300'}`}
                                                >
                                                    <img src={`http://localhost:5000${p.imageUrl}`} alt={p.name} className="h-20 w-full object-cover rounded" />
                                                    <p className="text-xs text-center mt-2 truncate font-medium text-gray-700">{p.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex items-center justify-center">
                                            <span className="text-gray-400 text-sm font-medium">-- OR --</span>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-3">Upload New File</p>
                                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            {uploading ? (
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
                                            ) : prescriptionImage && !savedPrescriptions.some(p => p.imageUrl === prescriptionImage) ? (
                                                <div className="mx-auto w-48 h-48 overflow-hidden rounded-lg">
                                                    <img src={`http://localhost:5000${prescriptionImage}`} alt="Prescription" className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => setPrescriptionImage(null)} className="mt-2 text-sm text-red-600 hover:text-red-500">Remove</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600 justify-center">
                                                        <label
                                                            htmlFor="file-upload"
                                                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                                                        >
                                                            <span>Upload a file</span>
                                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={uploadFileHandler} />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white px-4 py-5 shadow-sm sm:rounded-lg border border-gray-100 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Payment Method</h3>
                            <div className="mt-4 space-y-4">
                                <div className="flex items-center">
                                    <input
                                        id="cod"
                                        name="payment_method"
                                        type="radio"
                                        value="Cash on Delivery"
                                        checked={paymentMethod === 'Cash on Delivery'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                                    />
                                    <label htmlFor="cod" className="ml-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Banknote className="h-5 w-5 text-gray-400" />
                                        Cash on Delivery
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="online"
                                        name="payment_method"
                                        type="radio"
                                        value="Online"
                                        checked={paymentMethod === 'Online'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                                    />
                                    <label htmlFor="online" className="ml-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <CreditCard className="h-5 w-5 text-gray-400" />
                                        Online Payment (Card / UPI)
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                        >
                            Place Order
                        </button>
                    </form>
                </div>

                <div className="mt-8 md:mt-0 md:col-span-1">
                    <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-lg sticky top-24">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                        <div className="flow-root mb-6">
                            <ul className="-my-4 divide-y divide-gray-200">
                                {cart.map((item) => (
                                    <li key={item.medicine} className="py-4 flex items-center">
                                        <img src={item.image} alt={item.name} className="h-10 w-10 rounded-md object-cover border border-gray-200" />
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm font-medium text-gray-900 truncate" title={item.name}>{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                        </div>
                                        <div className="ml-2 text-sm font-medium text-gray-900">
                                            ₹{item.price * item.qty}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex justify-between">
                            <span className="text-base font-bold text-gray-900">Total</span>
                            <span className="text-base font-bold text-primary-600">₹{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
