import React from 'react';
import ItemCard from './ItemCard';

export default function ItemList({ items }) {
    if (!items || items.length === 0) {
        return <div className="text-center p-8 text-gray-500">No items found.</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
                <ItemCard key={item.id} item={item} />
            ))}
        </div>
    );
}
