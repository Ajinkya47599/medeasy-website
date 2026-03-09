import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Pill } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin');
            else navigate('/');
        }
    }, [user, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/users/login', { email, password });
            login(data);
            toast.success('Logged in successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Image */}
            <div className="hidden lg:flex w-1/2 relative bg-primary-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Medical Professional"
                    className="absolute inset-0 w-full h-full object-cover scale-105 animate-float"
                    style={{ animationDuration: '20s' }}
                />
                <div className="absolute bottom-12 left-12 z-20 text-white max-w-lg">
                    <Pill className="h-12 w-12 mb-6 text-primary-300" />
                    <h2 className="text-4xl font-bold mb-4">Your Wellness Journey Starts Here</h2>
                    <p className="text-lg text-primary-100">Access thousands of verified medicines, track your prescriptions, and consult with experts—all in one place.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 animate-fade-in">
                <div className="w-full max-w-md">
                    <div className="text-center lg:text-left mb-10">
                        <Link to="/" className="inline-block lg:hidden mb-6">
                            <Pill className="h-10 w-10 text-primary-600 mx-auto" />
                        </Link>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-slate-500">Sign in to your MedEasy account</p>
                    </div>

                    <form className="space-y-6" onSubmit={submitHandler}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-slate-700">Password</label>
                                <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500">Forgot password?</Link>
                            </div>
                            <input
                                type="password"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg hover:shadow-primary-500/30 transition-all hover:-translate-y-0.5"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <span className="text-slate-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                                Sign up
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
