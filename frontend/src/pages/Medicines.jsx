import { useState, useEffect, useContext } from 'react';
import { Search, ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const Medicines = () => {
    const [medicines, setMedicines] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [inStock, setInStock] = useState(false);

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const { addToCart } = useContext(CartContext);

    const fetchMedicines = async (searchKeyword = keyword) => {
        try {
            setLoading(true);
            let url = `/medicines?keyword=${searchKeyword}&category=${category}`;
            if (minPrice) url += `&minPrice=${minPrice}`;
            if (maxPrice) url += `&maxPrice=${maxPrice}`;
            if (inStock) url += `&inStock=true`;

            const { data } = await api.get(url);
            setMedicines(data);
        } catch (error) {
            toast.error('Failed to load medicines');
        } finally {
            setLoading(false);
        }
    };

    const fetchSuggestions = async (searchKeyword) => {
        if (!searchKeyword.trim()) {
            setSuggestions([]);
            return;
        }
        try {
            setIsSearching(true);
            const { data } = await api.get(`/medicines?keyword=${searchKeyword}&limit=5`);
            setSuggestions(data);
        } catch (error) {
            console.error('Failed to load suggestions', error);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        fetchMedicines();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, minPrice, maxPrice, inStock]);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (keyword) {
                fetchSuggestions(keyword);
            } else {
                setSuggestions([]);
                fetchMedicines(''); // fetch all when cleared
            }
        }, 300);
        return () => clearTimeout(delay);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keyword]);

    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        setShowSuggestions(false);
        fetchMedicines(keyword);
    };

    const categories = ['All', 'Fever', 'Cough & Cold', 'Pain Relief', 'Diabetes', 'Vitamins', 'First Aid'];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 animate-fade-in">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Our <span className="text-primary-600">Medicines</span></h1>

                {/* Search Bar */}
                <div className="relative w-full md:w-96 shadow-sm group z-20">
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder="Search by name, company, category..."
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white group-hover:shadow-md"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => {
                                if (keyword.trim()) setShowSuggestions(true);
                            }}
                            onBlur={() => {
                                // Delay hiding to allow clicking on suggestions
                                setTimeout(() => setShowSuggestions(false), 200);
                            }}
                        />
                        <button type="submit" className="absolute left-4 top-3.5"><Search className="h-5 w-5 text-slate-400 group-hover:text-primary-500 transition-colors" /></button>
                    </form>

                    {/* Autocomplete Dropdown */}
                    {showSuggestions && keyword.trim() && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20">
                            {isSearching ? (
                                <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
                            ) : suggestions.length > 0 ? (
                                <ul className="max-h-64 overflow-y-auto">
                                    {suggestions.map((med) => (
                                        <li key={med._id}>
                                            <Link
                                                to={`/medicine/${med._id}`}
                                                className="flex items-center px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                                            >
                                                <img src={med.image} alt={med.name} className="h-10 w-10 object-cover rounded shadow-sm mr-3" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800">{med.name}</span>
                                                    <span className="text-xs text-slate-500">{med.manufacturer} • {med.category}</span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-4 text-center text-sm text-slate-500">No matches found for "{keyword}"</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 animate-slide-up flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <span className="font-bold text-slate-700 text-sm uppercase tracking-wider hidden sm:inline-block">Filters:</span>
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            placeholder="Min ₹"
                            className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <span className="text-slate-400">-</span>
                        <input
                            type="number"
                            placeholder="Max ₹"
                            className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <label className="flex items-center cursor-pointer group">
                        <div className="relative">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={inStock}
                                onChange={(e) => setInStock(e.target.checked)}
                            />
                            <div className={`block w-12 h-7 rounded-full transition-colors ${inStock ? 'bg-primary-500' : 'bg-slate-200 group-hover:bg-slate-300'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${inStock ? 'transform translate-x-5' : ''}`}></div>
                        </div>
                        <span className="ml-3 text-sm font-bold text-slate-700">In Stock Only</span>
                    </label>
                </div>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto space-x-3 pb-4 mb-8 custom-scrollbar pt-2 animate-slide-up">
                {categories.map((c) => (
                    <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 ${category === c
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30 -translate-y-0.5'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-20 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-primary-600 mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading medicines...</p>
                </div>
            ) : medicines.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center animate-fade-in">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Search className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-xl font-bold mb-2">No medicines found</p>
                    <p className="text-slate-500">Try adjusting your search or category filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {medicines.map((med, index) => (
                        <div
                            key={med._id}
                            className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-primary-100/50 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col pt-0 animate-fade-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="h-56 bg-slate-50 relative overflow-hidden flex-shrink-0">
                                <img
                                    src={med.image}
                                    alt={med.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                {med.requiresPrescription && (
                                    <span className="absolute top-3 right-3 bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-100 shadow-sm backdrop-blur-sm z-10">
                                        Rx Required
                                    </span>
                                )}
                                <Link
                                    to={`/medicine/${med._id}`}
                                    className="absolute inset-0 z-0"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow relative z-10 bg-white">
                                <Link to={`/medicine/${med._id}`} className="group-hover:text-primary-600 transition-colors">
                                    <h3 className="text-lg font-extrabold text-slate-900 mb-1 line-clamp-1" title={med.name}>{med.name}</h3>
                                </Link>
                                <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md mb-4 w-max">{med.category}</span>

                                <div className="flex items-center mb-auto pt-1 pb-4">
                                    <div className="flex items-center bg-yellow-50 px-2 py-0.5 rounded text-yellow-600">
                                        <span className="text-sm font-bold">★ {med.rating?.toFixed(1) || '0.0'}</span>
                                    </div>
                                    <span className="text-slate-400 text-xs ml-2 font-medium">({med.numReviews || 0} reviews)</span>
                                </div>

                                <div className="flex justify-between items-end mb-5">
                                    <div>
                                        <p className="text-xs text-slate-400 font-medium mb-0.5">Price</p>
                                        <span className="text-2xl font-black text-slate-900 leading-none">₹{med.price}</span>
                                    </div>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${med.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                        {med.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>

                                <button
                                    onClick={() => {
                                        addToCart(med, 1);
                                        toast.success('Added to cart');
                                    }}
                                    disabled={med.stock === 0}
                                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center group/btn shadow-sm"
                                >
                                    <ShoppingCart className="h-5 w-5 mr-2 group-hover/btn:animate-bounce" />
                                    {med.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Medicines;
