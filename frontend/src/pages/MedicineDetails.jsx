import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Rating from '../components/Rating';
import { ShoppingCart, ArrowLeft, AlertTriangle, RefreshCw, Heart } from 'lucide-react';

const MedicineDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);

    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);

    // Review State
    const [rating, setRating] = useState(0);
    // Subscription State
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [subFrequency, setSubFrequency] = useState(30);

    // Wishlist State
    const [inWishlist, setInWishlist] = useState(false);

    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                const { data } = await api.get(`/medicines/${id}`);
                setMedicine(data);

                // Check wishlist status
                if (user) {
                    const wishRes = await api.get('/users/wishlist');
                    if (wishRes.data.some(w => w._id === id)) {
                        setInWishlist(true);
                    }
                }
                setLoading(false);
            } catch (error) {
                toast.error('Medicine not found');
                navigate('/medicines');
            }
        };
        fetchMedicine();
    }, [id, navigate, user]);

    const addToCartHandler = () => {
        addToCart(medicine, qty);
        toast.success('Added to cart');
    };

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        try {
            await api.post(`/medicines/${id}/reviews`, { rating, comment });
            toast.success('Review submitted successfully!');
            const { data } = await api.get(`/medicines/${id}`);
            setMedicine(data);
            setRating(0);
            setComment('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setReviewLoading(false);
        }
    };

    const subscribeHandler = async () => {
        if (!user) {
            toast.error('Please login to subscribe');
            return navigate('/login');
        }
        try {
            await api.post('/subscriptions', {
                medicine: medicine._id,
                qty: qty,
                frequencyDays: subFrequency
            });
            toast.success('Successfully subscribed!');
            navigate('/profile/subscriptions');
        } catch (error) {
            toast.error('Subscription failed');
        }
    };

    const toggleWishlistHandler = async () => {
        if (!user) {
            toast.error('Please login to add to wishlist');
            return navigate('/login');
        }
        try {
            await api.post('/users/wishlist', { medicineId: medicine._id });
            setInWishlist(!inWishlist);
            toast.success(inWishlist ? 'Removed from your favorites' : 'Added to your favorites');
        } catch (error) {
            toast.error('Failed to update wishlist');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link to="/medicines" className="inline-flex items-center text-slate-500 hover:text-primary-600 mb-8 font-semibold transition-colors group">
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Catalog
            </Link>

            {/* Product Overview Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-12 animate-slide-up">
                <div className="lg:flex">
                    {/* Image Gallery Side */}
                    <div className="lg:w-1/2 p-8 lg:p-16 flex justify-center items-center bg-gradient-to-br from-slate-50 to-white border-b lg:border-b-0 lg:border-r border-slate-100 relative group">
                        <div className="absolute inset-0 bg-primary-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        <img
                            src={medicine.image || '/images/sample.jpg'}
                            alt={medicine.name}
                            className="max-h-[32rem] object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500 filter drop-shadow-xl"
                        />
                        {medicine.requiresPrescription && (
                            <div className="absolute top-6 left-6 bg-red-50 text-red-600 px-4 py-1.5 rounded-full font-bold text-sm border border-red-100 shadow-sm backdrop-blur-md flex items-center">
                                <AlertTriangle className="h-4 w-4 mr-1.5" />
                                Rx Required
                            </div>
                        )}
                    </div>

                    {/* Details Side */}
                    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-4">
                            <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-sm font-bold rounded-lg tracking-wide">{medicine.category}</span>
                            <button
                                onClick={toggleWishlistHandler}
                                className="p-3 rounded-full hover:bg-red-50 transition-all duration-300 text-slate-400 hover:text-red-500 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-200"
                                title="Add to Wishlist"
                            >
                                <Heart className={`h-7 w-7 ${inWishlist ? 'fill-red-500 text-red-500' : ''} transition-colors`} />
                            </button>
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">{medicine.name}</h1>

                        <div className="flex items-center mb-8 gap-4">
                            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-100">
                                <span className="text-yellow-600 font-bold text-lg mr-1.5">★</span>
                                <span className="font-bold text-yellow-700">{medicine.rating?.toFixed(1) || '0.0'}</span>
                            </div>
                            <span className="text-sm font-medium text-slate-500 underline decoration-slate-300 underline-offset-4 cursor-pointer hover:text-slate-800 transition-colors">
                                {medicine.numReviews} verified reviews
                            </span>
                        </div>

                        <div className="prose prose-slate mb-10">
                            <p className="text-slate-600 text-lg leading-relaxed mb-6">
                                {medicine.description}
                            </p>

                            {/* Detailed Information */}
                            <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                {medicine.manufacturer && (
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Manufacturer</h3>
                                        <p className="text-slate-700 font-medium">{medicine.manufacturer}</p>
                                    </div>
                                )}

                                {medicine.ingredients && medicine.ingredients.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Active Ingredients</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {medicine.ingredients.map((item, idx) => (
                                                <span key={idx} className="bg-white border border-slate-200 px-3 py-1 rounded-full text-sm font-semibold text-slate-700 shadow-sm">{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {medicine.usage && (
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Usage Instructions</h3>
                                        <p className="text-slate-700 text-sm leading-relaxed">{medicine.usage}</p>
                                    </div>
                                )}

                                {medicine.sideEffects && medicine.sideEffects.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center">
                                            <AlertTriangle className="h-4 w-4 mr-1.5 text-amber-500" />
                                            Potential Side Effects
                                        </h3>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                                            {medicine.sideEffects.map((effect, idx) => (
                                                <li key={idx}>{effect}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-8 mt-auto">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <p className="text-sm text-slate-500 font-semibold mb-1">Price</p>
                                    <span className="text-5xl font-black text-slate-900 tracking-tight">₹{medicine.price}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-500 font-semibold mb-1">Availability</p>
                                    <span className={`inline-flex items-center px-4 py-1.5 text-sm font-bold rounded-full border ${medicine.stock > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                        <span className={`w-2 h-2 rounded-full mr-2 ${medicine.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                        {medicine.stock > 0 ? `${medicine.stock} in stock` : 'Out of Stock'}
                                    </span>
                                </div>
                            </div>

                            {medicine.stock > 0 && (
                                <div className="space-y-6">
                                    {/* Action Bar */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="relative">
                                            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs font-bold text-slate-500 z-10">Qty</label>
                                            <select
                                                value={qty}
                                                onChange={(e) => setQty(Number(e.target.value))}
                                                className="w-full sm:w-28 block appearance-none bg-white border-2 border-slate-200 rounded-xl px-4 py-4 text-center font-bold text-slate-800 focus:outline-none focus:border-primary-500 focus:ring-0 transition-colors cursor-pointer"
                                            >
                                                {[...Array(Math.min(medicine.stock, 10)).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <button
                                            onClick={addToCartHandler}
                                            className="flex-1 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-primary-600 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 flex justify-center items-center py-4 group"
                                        >
                                            <ShoppingCart className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                                            Add to Cart
                                        </button>
                                    </div>

                                    {/* Subscription Box */}
                                    <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-md">
                                        <div className="flex items-center justify-between cursor-pointer group" onClick={() => setIsSubscribing(!isSubscribing)}>
                                            <div className="flex items-center">
                                                <div className="bg-white p-2 rounded-lg shadow-sm mr-4 group-hover:scale-110 transition-transform">
                                                    <RefreshCw className="h-6 w-6 text-primary-600" />
                                                </div>
                                                <div>
                                                    <span className="block font-extrabold text-slate-900">Auto-Refill Subscription</span>
                                                    <span className="block text-sm text-slate-500">Never run out of your medicine</span>
                                                </div>
                                            </div>
                                            <span className="text-primary-600 bg-white px-4 py-1.5 rounded-full text-sm font-bold border border-primary-100 group-hover:bg-primary-600 group-hover:text-white transition-colors">{isSubscribing ? 'Cancel' : 'Set Up'}</span>
                                        </div>

                                        {isSubscribing && (
                                            <div className="mt-6 pt-6 border-t border-primary-200/60 animate-fade-in">
                                                <label className="block text-sm font-bold text-slate-800 mb-3">Delivery Frequency</label>
                                                <div className="flex gap-3 mb-6">
                                                    {[15, 30, 60].map(days => (
                                                        <button
                                                            key={days}
                                                            onClick={() => setSubFrequency(days)}
                                                            className={`flex-1 py-3 text-sm font-bold rounded-xl border-2 transition-all ${subFrequency === days ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/20' : 'bg-white text-slate-700 border-slate-200 hover:border-primary-300'}`}
                                                        >
                                                            Every {days} Days
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    onClick={subscribeHandler}
                                                    className="w-full bg-white text-primary-700 border-2 border-primary-200 py-3 rounded-xl font-extrabold hover:bg-primary-100 hover:border-primary-300 transition-all"
                                                >
                                                    Confirm Subscription
                                                </button>
                                                <p className="text-xs text-slate-500 mt-4 text-center">Billed automatically on dispatch via Cash on Delivery</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="grid lg:grid-cols-3 gap-12 mt-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {/* Review Form */}
                <div className="lg:col-span-1 order-2 lg:order-1">
                    <div className="sticky top-24">
                        <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Write a Review</h2>
                        {user ? (
                            <form onSubmit={submitReviewHandler} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Rating</label>
                                    <select
                                        required
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                        className="block w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-0 focus:border-primary-500 sm:text-sm font-medium text-slate-700 transition-colors cursor-pointer appearance-none bg-slate-50 focus:bg-white"
                                    >
                                        <option value="">Select your rating...</option>
                                        <option value="1">⭐ 1 - Poor</option>
                                        <option value="2">⭐⭐ 2 - Fair</option>
                                        <option value="3">⭐⭐⭐ 3 - Good</option>
                                        <option value="4">⭐⭐⭐⭐ 4 - Very Good</option>
                                        <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
                                    </select>
                                </div>
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Your Review</label>
                                    <textarea
                                        required
                                        rows="5"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="What did you like or dislike? How effectively did it work?"
                                        className="block w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-0 focus:border-primary-500 sm:text-sm transition-colors text-slate-700 bg-slate-50 focus:bg-white resize-none"
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 text-white rounded-xl py-3.5 font-bold hover:bg-primary-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md"
                                >
                                    {loading ? 'Submitting...' : 'Post Review'}
                                </button>
                            </form>
                        ) : (
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <Heart className="h-8 w-8 text-slate-300" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Join the Community</h3>
                                <p className="text-slate-500 mb-6 text-sm">Sign in to share your experience and read trusted reviews from verified buyers.</p>
                                <Link to="/login" className="inline-block w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition shadow-md hover:shadow-primary-500/30">
                                    Sign In to Review
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Review List */}
                <div className="lg:col-span-2 order-1 lg:order-2">
                    <h2 className="text-2xl font-extrabold text-slate-900 mb-6 flex items-center">
                        Customer Reviews
                        <span className="ml-3 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">{medicine.reviews.length}</span>
                    </h2>

                    {medicine.reviews.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-4xl">💭</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No reviews yet</h3>
                            <p className="text-slate-500">Be the first to review {medicine.name} and share your experience with others.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {medicine.reviews.map((review) => (
                                <div key={review._id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary-100 text-primary-700 font-bold rounded-full flex items-center justify-center text-lg">
                                                {review.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-slate-900 text-lg">{review.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Rating value={review.rating} />
                                                    <span className="text-sm text-slate-400 font-medium">• {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-slate-600 text-base leading-relaxed pl-16">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicineDetails;
