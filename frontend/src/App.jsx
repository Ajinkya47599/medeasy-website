import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Medicines from './pages/Medicines';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminMedicines from './pages/AdminMedicines';
import AdminMedicineEdit from './pages/AdminMedicineEdit';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminUserHistory from './pages/AdminUserHistory';
import AdminPrescriptions from './pages/AdminPrescriptions';
import MyPrescriptions from './pages/MyPrescriptions';
import MySubscriptions from './pages/MySubscriptions';
import MyWishlist from './pages/MyWishlist';
import MyReminders from './pages/MyReminders';
import MedicineDetails from './pages/MedicineDetails';

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/medicine/:id" element={<MedicineDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/prescriptions" element={<MyPrescriptions />} />
            <Route path="/profile/subscriptions" element={<MySubscriptions />} />
            <Route path="/profile/wishlist" element={<MyWishlist />} />
            <Route path="/profile/reminders" element={<MyReminders />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/medicines" element={<AdminMedicines />} />
            <Route path="/admin/medicines/:id/edit" element={<AdminMedicineEdit />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/prescriptions" element={<AdminPrescriptions />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id/orders" element={<AdminUserHistory />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
