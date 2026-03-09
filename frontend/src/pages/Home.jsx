import { Link } from 'react-router-dom';
import { Shield, Truck, Clock, Star, ChevronRight } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary-50 to-white -z-10" />
                <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" />
                <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float" style={{ animationDelay: '2s' }} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:grid lg:grid-cols-2 gap-12 items-center">
                        <div className="mb-12 lg:mb-0 animate-slide-up">
                            <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-6 shadow-sm border border-primary-200">
                                🚀 #1 Online Pharmacy
                            </span>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">Health</span>,<br /> Delivered Safely
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                                Experience the future of healthcare. Get genuine medicines, expert advice, and wellness products delivered to your door in minutes.
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link to="/medicines" className="px-8 py-3.5 bg-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all text-center">
                                    Shop Medicines
                                </Link>
                                <Link to="/register" className="px-8 py-3.5 bg-white text-slate-700 border border-slate-200 font-semibold rounded-xl shadow-sm hover:border-primary-300 hover:text-primary-600 hover:-translate-y-0.5 transition-all text-center">
                                    Create Account
                                </Link>
                            </div>
                        </div>
                        <div className="relative lg:ml-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-transparent rounded-3xl transform rotate-3 scale-105 -z-10" />
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
                                alt="Modern Medical Team"
                                className="rounded-3xl shadow-2xl object-cover h-[500px] w-full border-4 border-white"
                            />
                            {/* Floating Badge */}
                            <div className="absolute bottom-8 -left-8 bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-100 animate-float" style={{ animationDelay: '1s' }}>
                                <div className="bg-green-100 text-green-600 p-2 rounded-full">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">100% Genuine</p>
                                    <p className="text-xs text-slate-500">Verified Products</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-slide-up">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose MedEasy?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">We combine medical expertise with modern technology to provide you the best healthcare experience.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center relative z-10">
                        <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-primary-100 transition-all duration-300">
                                <Truck className="h-10 w-10 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800">Lightning Fast Delivery</h3>
                            <p className="text-slate-600 leading-relaxed">Most orders are delivered within 2 hours. Track your delivery in real-time.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary-50 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-secondary-100 transition-all duration-300">
                                <Shield className="h-10 w-10 text-secondary-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800">100% Genuine Products</h3>
                            <p className="text-slate-600 leading-relaxed">Directly sourced from trusted brands and verified manufacturers.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                                <Clock className="h-10 w-10 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-800">24/7 Expert Support</h3>
                            <p className="text-slate-600 leading-relaxed">Our team of pharmacists is always available to answer your questions.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Shop by Category Section */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">Shop by Category</h2>
                            <p className="text-slate-600">Find what you need quickly from our wide range of products.</p>
                        </div>
                        <Link to="/medicines" className="text-primary-600 font-semibold hover:text-primary-700 hover:underline hidden sm:block">
                            View All Categories &rarr;
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: 'Vitamins & Supplements', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80', color: 'bg-orange-100/50' },
                            { name: 'Personal Care', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&auto=format&fit=crop&q=80', color: 'bg-blue-100/50' },
                            { name: 'Health Devices', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80', color: 'bg-green-100/50' },
                            { name: 'Ayurvedic Care', image: 'https://images.unsplash.com/photo-1611078508544-e53b6cb651e6?w=500&auto=format&fit=crop&q=80', color: 'bg-yellow-100/50' }
                        ].map((category, idx) => (
                            <Link to={`/medicines?category=${category.name}`} key={idx} className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                                <div className={`absolute inset-0 ${category.color} mix-blend-multiply opacity-50 group-hover:opacity-20 transition-opacity z-10`} />
                                <img src={category.image} alt={category.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20" />
                                <div className="absolute bottom-0 left-0 p-5 z-30 w-full">
                                    <h3 className="text-white font-bold text-lg leading-tight group-hover:-translate-y-1 transition-transform">{category.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Promotional Banner */}
            <section className="py-20 relative overflow-hidden bg-slate-900 border-y border-slate-800">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584982751601-97d8838a9618?w=2000&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/80 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="md:w-1/2">
                        <span className="inline-block py-1 px-3 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">Limited Time Offer</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
                            Get 20% Off on Your First Order!
                        </h2>
                        <p className="text-primary-100 text-lg mb-8 max-w-md drop-shadow-sm">
                            Download our app or sign up today to unlock exclusive discounts on medicines, health devices, and more.
                        </p>
                        <Link to="/register" className="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-bold rounded-xl shadow-lg hover:bg-primary-50 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                            Claim Offer Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trending Products Preview */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900">Trending Now</h2>
                        <Link to="/medicines" className="flex items-center text-primary-600 font-semibold hover:text-primary-700 group">
                            Explore All <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Optimum Nutrition Gold Standard 100% Whey', price: '₹2,999', rating: 4.8, reviews: 124, img: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', tag: 'Bestseller' },
                            { name: 'Cetaphil Gentle Skin Cleanser', price: '₹285', rating: 4.9, reviews: 89, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', tag: 'Trending' },
                            { name: 'Accu-Chek Active Blood Glucose Meter', price: '₹899', rating: 4.7, reviews: 45, img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', tag: '15% Off' },
                            { name: 'Himalaya Ashvagandha General Wellness', price: '₹180', rating: 4.5, reviews: 210, img: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', tag: 'Ayurvedic' }
                        ].map((product, idx) => (
                            <Link to="/medicines" key={idx} className="group flex flex-col bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-4 p-4">
                                    <img src={product.img} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                                    {product.tag && (
                                        <span className="absolute top-3 left-3 bg-secondary-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                                            {product.tag}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <h3 className="font-semibold text-slate-800 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center space-x-1 mb-2">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium text-slate-700">{product.rating}</span>
                                        <span className="text-xs text-slate-500">({product.reviews})</span>
                                    </div>
                                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                                        <span className="font-bold text-lg text-slate-900">{product.price}</span>
                                        <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                            <span className="font-bold text-lg leading-none">+</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
