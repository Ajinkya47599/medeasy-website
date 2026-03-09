import { Link } from 'react-router-dom';
import { Pill, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand Section */}
                    <div>
                        <Link to="/" className="flex items-center mb-6">
                            <Pill className="h-8 w-8 text-primary-500 mr-2" />
                            <span className="text-2xl font-extrabold tracking-tight text-white">MedEasy</span>
                        </Link>
                        <p className="text-sm leading-relaxed mb-6">
                            Your trusted online pharmacy. We deliver authentic medicines, health products, and expert care right to your doorstep, 24/7.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/medicines" className="hover:text-primary-400 transition-colors">Order Medicines</Link></li>
                            <li><Link to="/profile/prescriptions" className="hover:text-primary-400 transition-colors">Upload Prescription</Link></li>
                            <li><Link to="/cart" className="hover:text-primary-400 transition-colors">Your Cart</Link></li>
                            <li><Link to="/register" className="hover:text-primary-400 transition-colors">Create Account</Link></li>
                        </ul>
                    </div>

                    {/* Top Categories */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Top Categories</h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/medicines" className="hover:text-primary-400 transition-colors">Vitamins & Supplements</Link></li>
                            <li><Link to="/medicines" className="hover:text-primary-400 transition-colors">Diabetes Care</Link></li>
                            <li><Link to="/medicines" className="hover:text-primary-400 transition-colors">Personal Care</Link></li>
                            <li><Link to="/medicines" className="hover:text-primary-400 transition-colors">Health Devices</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Contact Us</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 text-primary-500 mr-3 shrink-0 mt-0.5" />
                                <span>123 Health Avenue, MedCity,<br />MC 40001, India</span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 text-primary-500 mr-3 shrink-0" />
                                <span>9653272514</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 text-primary-500 mr-3 shrink-0" />
                                <span>medeasy@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                    <p className="mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} MedEasy Pharmacy. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        <Link to="#" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
                        <Link to="#" className="hover:text-primary-400 transition-colors">Returns & Refunds</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
