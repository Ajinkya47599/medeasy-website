import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Pill } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();

        // Password Validation Regex:
        // (?=.*[A-Z]) -> At least one uppercase letter
        // (?=.*\d) -> At least one number
        // (?=.*[^A-Za-z0-9]) -> At least one special character
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;

        if (password.length < 6) return toast.error('Password must be at least 6 characters');
        if (!passwordRegex.test(password)) {
            return toast.error('Password must contain at least one uppercase letter, one number, and one special character');
        }
        if (!phone) {
            return toast.error('Phone number is required');
        }

        const phoneNumber = parsePhoneNumber(phone);

        if (!phoneNumber || !phoneNumber.isValid()) {
            return toast.error('Invalid phone number for the selected country');
        }

        // Additional strict rule: Indian numbers specifically must be exactly 10 digits
        if (phoneNumber.country === 'IN' && phoneNumber.nationalNumber.length !== 10) {
            return toast.error('Indian phone numbers must be exactly 10 digits');
        }

        setLoading(true);

        try {
            if (!showOtpInput) {
                // Step 1: Send OTP
                await api.post('/users/send-otp', { email });
                toast.success('OTP sent to your email!');
                setShowOtpInput(true);
            } else {
                // Step 2: Verify OTP and Register
                if (!otp) {
                    setLoading(false);
                    return toast.error('Please enter the OTP');
                }
                const { data } = await api.post('/users', { name, email, password, phone, address, otp });
                login(data);
                toast.success('Registration successful');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image */}
            <div className="hidden lg:flex w-1/2 relative bg-primary-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 to-primary-900/20 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1550831107-1553da8c8464?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Pharmacy"
                    className="absolute inset-0 w-full h-full object-cover scale-105 animate-float"
                    style={{ animationDuration: '25s' }}
                />
                <div className="absolute bottom-12 left-12 z-20 text-white max-w-lg">
                    <Pill className="h-12 w-12 mb-6 text-primary-300" />
                    <h2 className="text-4xl font-bold mb-4">Join the Healthcare Revolution</h2>
                    <p className="text-lg text-primary-100">Create your MedEasy account today to get fast deliveries, authentic medicines, and exclusive discounts.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 animate-fade-in overflow-y-auto max-h-screen custom-scrollbar">
                <div className="w-full max-w-md my-auto pb-10">
                    <div className="text-center lg:text-left mb-8 mt-8 lg:mt-0">
                        <Link to="/" className="inline-block lg:hidden mb-4">
                            <Pill className="h-10 w-10 text-primary-600 mx-auto" />
                        </Link>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
                        <p className="mt-2 text-slate-500">Join MedEasy in just two steps</p>
                    </div>

                    <form className="space-y-5" onSubmit={submitHandler}>
                        {!showOtpInput ? (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-slate-50 focus:bg-white"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-slate-50 focus:bg-white"
                                        placeholder="john@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                                    <PhoneInput
                                        international
                                        defaultCountry="IN"
                                        value={phone}
                                        onChange={setPhone}
                                        disabled={loading}
                                        className="flex w-full [&>input]:appearance-none [&>input]:block [&>input]:w-full [&>input]:px-4 [&>input]:py-3 [&>input]:border [&>input]:border-slate-200 [&>input]:rounded-xl [&>input]:shadow-sm [&>input]:bg-slate-50 [&>input]:focus:bg-white [&>input]:focus:outline-none [&>input]:focus:ring-2 [&>input]:focus:ring-primary-500 [&>input]:transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Delivery Address</label>
                                    <input
                                        type="text"
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-slate-50 focus:bg-white"
                                        placeholder="123 Main St, City"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-slate-50 focus:bg-white"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                    <p className="mt-1.5 text-xs text-slate-500">Must contain an uppercase letter, number, and special character.</p>
                                </div>
                            </>
                        ) : (
                            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 text-center animate-slide-up">
                                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Check your email</h3>
                                <p className="text-sm text-slate-600 mb-6">
                                    We sent a 6-digit verification code to <br /><span className="font-semibold text-slate-900">{email}</span>
                                </p>

                                <label className="block text-sm font-bold text-slate-700 mb-2 text-left">Verification Code</label>
                                <input
                                    type="text"
                                    required
                                    maxLength="6"
                                    placeholder="000000"
                                    className="appearance-none block w-full px-4 py-4 text-center text-3xl tracking-[0.5em] font-bold border border-slate-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                    disabled={loading}
                                />
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white ${loading ? 'bg-primary-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5'} transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : !showOtpInput ? (
                                    'Verify Email'
                                ) : (
                                    'Complete Registration'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <span className="text-slate-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                                Sign in
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
