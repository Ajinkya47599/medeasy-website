import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Bell, Trash2, PlusCircle, CheckCircle, XCircle, Clock, Package } from 'lucide-react';

const MyReminders = () => {
    const { user } = useContext(AuthContext);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [medicineName, setMedicineName] = useState('');
    const [time, setTime] = useState('');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const { data } = await api.get('/users/reminders');
                setReminders(data);
            } catch (error) {
                toast.error('Failed to fetch reminders');
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchReminders();
    }, [user]);

    const addReminderHandler = async (e) => {
        e.preventDefault();
        if (!medicineName || !time) return toast.error('Please enter medicine name and time');

        setAdding(true);
        try {
            const { data } = await api.post('/users/reminders', { medicineName, time });
            setReminders(data);
            toast.success('Reminder added');
            setMedicineName('');
            setTime('');
        } catch (error) {
            toast.error('Failed to add reminder');
        } finally {
            setAdding(false);
        }
    };

    const toggleHandler = async (id) => {
        try {
            const { data } = await api.put(`/users/reminders/${id}/toggle`);
            setReminders(data);
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this reminder?')) {
            try {
                const { data } = await api.delete(`/users/reminders/${id}`);
                setReminders(data);
                toast.success('Reminder deleted');
            } catch (error) {
                toast.error('Failed to delete reminder');
            }
        }
    };

    if (!user) return <div className="p-8 text-center text-xl">Please Login First</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:grid md:grid-cols-4 md:gap-8">
                <div className="md:col-span-1 border-r border-gray-200 pr-4">
                    <div className="text-center py-6 bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="inline-flex justify-center items-center h-20 w-20 rounded-full bg-primary-100 mb-4">
                            <User className="h-10 w-10 text-primary-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 truncate">{user.name}</h2>
                        <p className="text-sm text-gray-500 mt-1 truncate">{user.email}</p>
                    </div>

                    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 p-2">
                        <nav className="space-y-1">
                            <Link to="/profile" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                                <Package className="mr-3 h-5 w-5 text-gray-400" />
                                Order History
                            </Link>
                            <Link to="/profile/reminders" className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-primary-50 text-primary-700">
                                <Bell className="mr-3 h-5 w-5 text-primary-500" />
                                Medicine Reminders
                            </Link>
                        </nav>
                    </div>
                </div>

                <div className="md:col-span-3 mt-8 md:mt-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Bell className="mr-2 h-6 w-6 text-primary-600" />
                            Daily Medication Schedule
                        </h2>
                    </div>

                    {/* Add New Reminder Form */}
                    <form onSubmit={addReminderHandler} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 max-w-2xl">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Reminder</h3>
                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1 w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Lisinopril 10mg"
                                    value={medicineName}
                                    onChange={(e) => setMedicineName(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-gray-900"
                                />
                            </div>
                            <div className="w-full sm:w-48">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time to Take</label>
                                <input
                                    type="time"
                                    required
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-gray-900"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={adding}
                                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm"
                            >
                                {adding ? 'Adding...' : <><PlusCircle className="mr-2 h-4 w-4" /> Add</>}
                            </button>
                        </div>
                    </form>

                    {/* Reminder List */}
                    {loading ? (
                        <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div></div>
                    ) : reminders.length === 0 ? (
                        <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-100 text-gray-500">
                            You have no active medicine reminders. Keep track of your daily doses here!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {reminders.map((r) => (
                                <div key={r._id} className={`bg-white border rounded-lg shadow-sm p-5 flex items-start justify-between transition-colors ${r.isActive ? 'border-primary-200 bg-primary-50/30' : 'border-gray-200 bg-gray-50'}`}>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className={`text-lg font-bold truncate ${r.isActive ? 'text-gray-900' : 'text-gray-500 line-through'}`}>{r.medicineName}</h4>
                                            {r.isActive && <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span></span>}
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm mt-2">
                                            <Clock className="mr-1.5 h-4 w-4 text-gray-400" />
                                            <span className="font-medium bg-white px-2 py-0.5 rounded border shadow-sm">
                                                {new Date(`2000-01-01T${r.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 ml-4">
                                        <button
                                            onClick={() => toggleHandler(r._id)}
                                            className={`p-1.5 rounded-full transition-colors ${r.isActive ? 'text-green-600 hover:bg-green-100 bg-green-50' : 'text-gray-400 hover:bg-gray-200 bg-gray-100'}`}
                                            title={r.isActive ? "Pause Reminder" : "Enable Reminder"}
                                        >
                                            {r.isActive ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                                        </button>
                                        <button
                                            onClick={() => deleteHandler(r._id)}
                                            className="p-1.5 rounded-full text-red-500 hover:bg-red-100 bg-red-50 transition-colors"
                                            title="Delete Reminder"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyReminders;
