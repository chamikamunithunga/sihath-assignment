import { createBrowserRouter, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Categories from './pages/Categories';
import ItemDetail from './pages/ItemDetail';
import CategoryDetail from './pages/CategoryDetail';
import BookingPage from './pages/BookingPage';
import NotFound from './pages/NotFound';
import Offline from './pages/Offline';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

const Layout = () => (
    <AuthProvider>
        <AppProvider>
            <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
                <a href="#main-content" className="skip-to-content">
                    Skip to main content
                </a>
                <Navbar />
                <main id="main-content" className="flex-grow container mx-auto px-4 py-8" role="main" tabIndex="-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </AppProvider>
    </AuthProvider>
);

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Home /> },
            { path: 'categories', element: <Categories /> },
            { path: 'categories/:categoryId', element: <CategoryDetail /> },
            { path: 'item/:id', element: <ItemDetail /> },
            { path: 'booking/:id', element: <BookingPage /> },
            { path: 'login', element: <Login /> },
            { path: 'signup', element: <Signup /> },
            { path: 'cart', element: <CartPage /> },
            { path: 'orders', element: <OrdersPage /> },
            { path: 'admin', element: <AdminDashboard /> },
            { path: 'offline', element: <Offline /> },
        ],
    },
]);
