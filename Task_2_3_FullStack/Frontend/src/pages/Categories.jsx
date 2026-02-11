// src/pages/Categories.jsx - Overview version
import { useState } from 'react';
import { Link } from 'react-router-dom';
import data from '../data/seed.json';

function CategoriesOverview() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = data.categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Explore By Category</h1>

            {/* Search Filter */}
            <div className="max-w-md mx-auto mb-10">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-5 py-3 rounded-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {filteredCategories.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-8">
                    {filteredCategories.map(category => {
                        // Simple local image paths from public/Images folder
                        let imagePath = '/Images/products.jpg';
                        if (category.id === 'workshops') imagePath = '/Images/workshops.jpg';
                        if (category.id === 'events') imagePath = '/Images/events.jpg';

                        return (
                            <Link
                                key={category.id}
                                to={`/categories/${category.id}`}
                                className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                {/* Simple img tag with local image */}
                                <img
                                    src={imagePath}
                                    alt={category.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                                    <h2 className="text-2xl font-bold mb-2">{category.name}</h2>
                                    <span className="text-sm font-semibold uppercase tracking-wider opacity-90 group-hover:translate-x-2 transition-transform duration-300">
                                        View All &rarr;
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-10">
                    <p className="text-xl">No categories found matching "{searchTerm}"</p>
                </div>
            )}
        </div>
    );
}

export default CategoriesOverview;