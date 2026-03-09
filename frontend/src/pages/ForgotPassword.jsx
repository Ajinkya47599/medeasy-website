import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { Pill, Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/users/forgot-password', { email });
            toast.success(data.message || 'Password reset link sent');
            setSuccess(true);
            setEmail('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Email not found');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                <div>
                    <div className="flex justify-center flex-col items-center">
                        <div className="h-16 w-16 bg-primary-100 rounded-full flex justify-center items-center mb-4">
                            <Pill className="h-8 w-8 text-primary-600" />
                        </div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">Forgot Password</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>
                </div>

                {success ? (
                    <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-100 text-center">
                        <Mail className="h-10 w-10 text-green-500 mx-auto mb-2" />
                        <h3 className="font-bold text-lg mb-1">Check your inbox!</h3>
                        <p className="text-sm">We've sent a secure password reset link to your email address.</p>
                        <button
                            onClick={() => setSuccess(false)}
                            className="mt-4 text-sm font-semibold text-green-700 hover:text-green-800 underline"
                        >
                            Try another email
                        </button>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={submitHandler}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-xl relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm bg-slate-50"
                                    placeholder="Registered Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Sending...
                                    </div>
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center mt-6">
                    <Link to="/login" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
