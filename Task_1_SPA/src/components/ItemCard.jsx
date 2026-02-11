import React from 'react';
import { Link } from 'react-router-dom';

export default function ItemCard({ item }) {
    return (
        <article className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
            <img src={item.image} alt={`${item.name} - ${item.description}`} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                    <span className="font-bold text-urban-green-700">
                        {item.category === 'workshop' ? `Tickets: $${item.price}` : `$${item.price}/${item.unit}`}
                    </span>
                    <Link
                        to={`/item/${item.id}`}
                        className="px-4 py-2 bg-urban-green-600 text-white rounded hover:bg-urban-green-700 text-sm"
                        aria-label={`View details for ${item.name}`}
                    >
                        View
                    </Link>
                </div>
            </div>
        </article>
    );
}
