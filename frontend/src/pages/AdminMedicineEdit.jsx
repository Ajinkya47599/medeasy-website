import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminMedicineEdit = () => {
    const { id: medicineId } = useParams();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [description, setDescription] = useState('');
    const [requiresPrescription, setRequiresPrescription] = useState(false);
    const [expiryDate, setExpiryDate] = useState('');

    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchMedicine = async () => {
            try {
                const { data } = await api.get(`/medicines/${medicineId}`);
                setName(data.name);
                setPrice(data.price);
                setImage(data.image);
                setCategory(data.category);
                setStock(data.stock);
                setDescription(data.description);
                setRequiresPrescription(data.requiresPrescription);
                setExpiryDate(data.expiryDate ? data.expiryDate.split('T')[0] : '');
            } catch (error) {
                toast.error('Medicine not found');
            } finally {
                setLoading(false);
            }
        };
        fetchMedicine();
    }, [medicineId, user, navigate]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const { data } = await api.post('/upload', formData);
            setImage(data);
            setUploading(false);
            toast.success('Image uploaded');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Image upload failed');
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/medicines/${medicineId}`, {
                name,
                price,
                image,
                category,
                stock,
                description,
                requiresPrescription,
                expiryDate,
            });
            toast.success('Medicine updated');
            navigate('/admin/medicines');
        } catch (error) {
            toast.error('Update failed');
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center space-x-4 mb-8">
                <button onClick={() => navigate('/admin/medicines')} className="text-gray-500 hover:text-primary-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 className="text-3xl font-extrabold text-gray-900">Edit Medicine</h1>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock Count</label>
                            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL or Upload</label>
                        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 mb-2" />
                        <input type="file" onChange={uploadFileHandler} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                        {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center mt-6">
                            <input id="req_rx" type="checkbox" checked={requiresPrescription} onChange={(e) => setRequiresPrescription(e.target.checked)} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                            <label htmlFor="req_rx" className="ml-2 block text-sm text-gray-900">Requires Prescription</label>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                            <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button type="button" onClick={() => navigate('/admin/medicines')} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3">Cancel</button>
                        <button type="submit" className="bg-primary-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">Update Medicine</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminMedicineEdit;
