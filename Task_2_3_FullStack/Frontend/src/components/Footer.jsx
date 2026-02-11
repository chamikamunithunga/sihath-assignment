import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { subscriptionService } from '../services/api';

export default function Footer() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            await subscriptionService.subscribe(email);
            setStatus({ type: 'success', message: 'Subscribed successfully!' });
            setEmail('');
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Subscription failed.' });
        }
    };

    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8" role="contentinfo">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
                    {/* Brand Section */}
                    <section aria-labelledby="footer-brand">
                        <h2 id="footer-brand" className="text-2xl font-bold text-white mb-4">Urban Harvest Hub</h2>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            {t('footer.brand_desc')}
                        </p>

                        {/* Subscription Form */}
                        <form onSubmit={handleSubscribe} className="mb-6">
                            <label htmlFor="newsletter-email" className="block text-sm font-semibold mb-2 text-white">Subscribe to our newsletter</label>
                            <div className="flex">
                                <input
                                    type="email"
                                    id="newsletter-email"
                                    placeholder="Enter your email"
                                    className="bg-gray-800 text-white px-4 py-2 rounded-l-lg outline-none focus:ring-1 focus:ring-green-500 w-full"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-lg transition-colors">
                                    Subscribe
                                </button>
                            </div>
                            {status.message && (
                                <p className={`text-sm mt-2 ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                    {status.message}
                                </p>
                            )}
                        </form>

                        <div className="flex space-x-4" role="list" aria-label="Social media links">
                            {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all duration-300"
                                    aria-label={`Follow us on ${social.charAt(0).toUpperCase() + social.slice(1)}`}
                                    role="listitem"
                                >
                                    <span className="capitalize" aria-hidden="true">{social[0]}</span>
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* Quick Links */}
                    <nav aria-labelledby="footer-links">
                        <h3 id="footer-links" className="text-lg font-semibold text-white mb-6">{t('footer.links_title')}</h3>
                        <ul className="space-y-3">
                            {[
                                { name: t('nav.home'), path: '/' },
                                { name: t('nav.categories'), path: '/categories' },
                                { name: t('categories.data.events.name'), path: '/categories/events' },
                                { name: t('nav.workshops'), path: '/workshops' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="hover:text-green-400 transition-colors duration-200 block"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Contact Info */}
                    <section aria-labelledby="footer-contact">
                        <h3 id="footer-contact" className="text-lg font-semibold text-white mb-6">{t('footer.contact_title')}</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="mr-3 mt-1" aria-hidden="true">📍</span>
                                <span>
                                    {t('footer.address').split(', ').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}{i < 2 ? <br /> : ''}
                                        </React.Fragment>
                                    ))}
                                </span>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-3" aria-hidden="true">📧</span>
                                <a href="mailto:hello@urbanharvest.com" className="hover:text-green-400 transition-colors">
                                    hello@urbanharvest.com
                                </a>
                            </li>
                            <li className="flex items-center">
                                <span className="mr-3" aria-hidden="true">📞</span>
                                <a href="tel:+1234567890" className="hover:text-green-400 transition-colors">
                                    (555) 123-4567
                                </a>
                            </li>
                        </ul>
                    </section>


                </div>

                <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Urban Harvest Hub. {t('footer.rights')}</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
                        <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
                        <a href="#" className="hover:text-white transition-colors">{t('footer.cookies')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
