import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8" role="contentinfo">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <section aria-labelledby="footer-brand">
                        <h2 id="footer-brand" className="text-2xl font-bold text-white mb-4">Urban Harvest Hub</h2>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            {t('footer.brand_desc')}
                        </p>
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
                                { name: t('footer.about'), path: '#' },
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

                    {/* Newsletter */}
                    <section aria-labelledby="footer-newsletter">
                        <h3 id="footer-newsletter" className="text-lg font-semibold text-white mb-6">{t('footer.newsletter_title')}</h3>
                        <p className="text-gray-400 mb-4 text-sm">
                            {t('footer.newsletter_desc')}
                        </p>
                        <form className="space-y-3" onSubmit={(e) => e.preventDefault()} aria-label="Newsletter signup">
                            <label htmlFor="newsletter-email" className="sr-only">{t('footer.placeholder')}</label>
                            <input
                                id="newsletter-email"
                                type="email"
                                placeholder={t('footer.placeholder')}
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors text-white"
                                required
                                aria-required="true"
                            />
                            <button
                                type="submit"
                                className="w-full px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-500 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                            >
                                {t('footer.subscribe')}
                            </button>
                        </form>
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
