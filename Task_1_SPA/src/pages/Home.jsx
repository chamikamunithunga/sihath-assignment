import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import data from '../data/seed.json';
import WeatherWidget from '../components/WeatherWidget';

function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="container mx-auto px-4 pt-8">
        <WeatherWidget />
      </div>
      {/* Hero Section */}
      <section
        className="relative h-[500px] flex items-center justify-center text-center text-white overflow-hidden"
        aria-label={t('hero.title')}
      >
        {/* Background Image  */}
        <img
          src="/Images/hero-banner.jpg"
          alt="Urban Harvest Community"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50" aria-hidden="true"></div>

        {/* Content */}
        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light text-gray-100">
            {t('hero.subtitle')}
          </p>
          <Link
            to="/categories"
            className="inline-block bg-eco-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {t('hero.cta')}
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-12" aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="text-3xl font-bold mb-8">{t('categories.title')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Products Category */}
          <Link
            to="/categories/products"
            className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            aria-label="View all Products"
          >
            {/* products */}
            <img
              src="/Images/products.jpg"
              alt="Products"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h3 className="text-xl font-bold mb-1">Products</h3>
              <span className="text-sm font-semibold uppercase tracking-wider opacity-90 group-hover:translate-x-2 transition-transform duration-300">
                View All &rarr;
              </span>
            </div>
          </Link>

          {/* Workshops Category */}
          <Link
            to="/categories/workshops"
            className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            aria-label="View all Workshops"
          >
            {/* Simple image path from public folder */}
            <img
              src="/Images/workshops.jpg"
              alt="Workshops"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h3 className="text-xl font-bold mb-1">Workshops</h3>
              <span className="text-sm font-semibold uppercase tracking-wider opacity-90 group-hover:translate-x-2 transition-transform duration-300">
                View All &rarr;
              </span>
            </div>
          </Link>

          {/* Events Category */}
          <Link
            to="/categories/events"
            className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            aria-label="View all Events"
          >
            {/* Simple image path from public folder */}
            <img
              src="/Images/events.jpg"
              alt="Events"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <h3 className="text-xl font-bold mb-1">Events</h3>
              <span className="text-sm font-semibold uppercase tracking-wider opacity-90 group-hover:translate-x-2 transition-transform duration-300">
                View All &rarr;
              </span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;