// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { Menu, X, Bell, Languages } from 'lucide-react';
import { notificationService } from '../services/notifications';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { cart: userCart } = useApp();
    const { t, i18n } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'fr' : 'en';
        i18n.changeLanguage(newLang);
    };

    // Function to determine if link is active
    const isActive = (path) => {
        return location.pathname === path ? "text-eco-green font-bold" : "text-gray-600 hover:text-eco-green";
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const handleSubscribe = async () => {
        const permission = await notificationService.requestPermission();
        if (permission === 'granted') {
            await notificationService.subscribeUser();
            alert("You have subscribed to notifications!");
            notificationService.testNotification();
        } else {
            alert("Notification permission denied or ignored.");
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md transition-all duration-300" aria-label="Main navigation">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center space-x-2 group" aria-label="Urban Harvest Hub - Home" onClick={closeMenu}>
                        <span className="text-3xl transition-transform duration-300 group-hover:rotate-12" aria-hidden="true">🌿</span>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500">
                            Urban Harvest
                        </span>
                    </Link>

                    {/* Mobile Menu Button & Cart (Visible on Mobile) */}
                    <div className="flex items-center space-x-4 md:hidden">
                        <Link to="/cart" className="relative text-gray-600 hover:text-eco-green transition-colors" onClick={closeMenu}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {userCart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {userCart.length}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-green-600 focus:outline-none"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className={`${isActive('/')} transition-colors duration-200 text-lg`}>
                                {t('nav.home')}
                            </Link>
                            <Link to="/categories" className={`${isActive('/categories')} transition-colors duration-200 text-lg`}>
                                {t('nav.categories')}
                            </Link>
                            <Link to="/categories/workshops" className={`${isActive('/categories/workshops')} transition-colors duration-200 text-lg`}>
                                {t('nav.workshops')}
                            </Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className={`${isActive('/admin')} transition-colors duration-200 text-lg text-blue-600 font-bold`}>
                                    {t('nav.admin')}
                                </Link>
                            )}
                        </div>

                        {/* Cart & Auth (Desktop) */}
                        <div className="flex items-center space-x-4">
                            {/* Notification Bell */}
                            <button
                                onClick={handleSubscribe}
                                className="text-gray-600 hover:text-eco-green transition-colors"
                                aria-label="Enable Notifications"
                            >
                                <Bell className="h-6 w-6" />
                            </button>

                            <button
                                onClick={toggleLanguage}
                                className="flex items-center space-x-1 text-gray-600 hover:text-eco-green transition-colors text-sm font-bold border rounded-full px-2 py-1"
                                aria-label="Toggle Language"
                            >
                                <Languages size={16} />
                                <span>{i18n.language.toUpperCase()}</span>
                            </button>

                            <Link to="/cart" className="relative text-gray-600 hover:text-eco-green transition-colors" aria-label={`Shopping cart with ${userCart.length} items`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {userCart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                        {userCart.length}
                                    </span>
                                )}
                            </Link>

                            {/* Auth Section */}
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <span className="block text-gray-700 font-medium text-sm">{t('nav.signin').split(' ')[0]}, {user.name}</span>
                                        <Link to="/orders" className="text-xs text-eco-green hover:underline">{t('nav.my_orders')}</Link>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm"
                                    >
                                        {t('nav.logout')}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium">
                                        {t('nav.signin')}
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="bg-eco-green text-white px-5 py-2 rounded-full font-semibold shadow-md hover:bg-green-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                    >
                                        {t('nav.join')}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col space-y-4 pt-4">
                            <Link to="/" className={`${isActive('/')} block px-2 text-lg`} onClick={closeMenu}>
                                {t('nav.home')}
                            </Link>
                            <Link to="/categories" className={`${isActive('/categories')} block px-2 text-lg`} onClick={closeMenu}>
                                {t('nav.categories')}
                            </Link>
                            <Link to="/categories/workshops" className={`${isActive('/categories/workshops')} block px-2 text-lg`} onClick={closeMenu}>
                                {t('nav.workshops')}
                            </Link>
                            {user?.role === 'admin' && (
                                <Link to="/admin" className={`${isActive('/admin')} block px-2 text-lg text-blue-600 font-bold`} onClick={closeMenu}>
                                    {t('nav.admin')}
                                </Link>
                            )}

                            <hr className="border-gray-100" />

                            <div className="flex justify-between items-center px-2">
                                <button
                                    onClick={() => { handleSubscribe(); closeMenu(); }}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-eco-green py-2"
                                >
                                    <Bell className="h-5 w-5" />
                                    <span>Notifications</span>
                                </button>
                                <button
                                    onClick={toggleLanguage}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-eco-green py-2 font-bold"
                                >
                                    <Languages size={18} />
                                    <span>{i18n.language.toUpperCase()}</span>
                                </button>
                            </div>

                            <hr className="border-gray-100" />

                            {user ? (
                                <div className="px-2 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-700">{t('nav.signin').split(' ')[0]}, {user.name}</span>
                                        <button onClick={() => { logout(); closeMenu(); }} className="text-red-500 text-sm font-medium">
                                            {t('nav.logout')}
                                        </button>
                                    </div>
                                    <Link to="/orders" className="block text-sm text-eco-green hover:underline" onClick={closeMenu}>
                                        {t('nav.my_orders')}
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-3 px-2">
                                    <Link to="/login" className="text-gray-700 hover:text-green-600 font-medium" onClick={closeMenu}>
                                        {t('nav.signin')}
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="bg-eco-green text-white px-5 py-3 rounded-xl font-semibold text-center shadow-sm"
                                        onClick={closeMenu}
                                    >
                                        {t('nav.join')}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
