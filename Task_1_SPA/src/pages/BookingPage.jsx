import { useParams, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import data from '../data/seed.json';

function BookingPage() {
    const { id } = useParams(); // id can be 'checkout'
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { addOrder } = useAuth(); // Getting addOrder from AuthContext
    const { cart, clearCart, cartTotal } = useApp();

    const [item, setItem] = useState(null);
    const isCartCheckout = id === 'checkout';

    useEffect(() => {
        if (!isCartCheckout) {
            const allItems = [...data.products, ...data.workshops, ...data.events];
            const found = allItems.find(i => i.id === parseInt(id));
            setItem(found);
        }
    }, [id, isCartCheckout]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newOrder = {
            id: Date.now(),
            date: new Date().toISOString(),
            status: 'Processing',
            items: isCartCheckout ? cart : [item],
            total: isCartCheckout ? cartTotal : item.price
        };

        addOrder(newOrder);

        if (isCartCheckout) {
            clearCart();
        }

        alert('Thank you! Your order/registration has been received and added to your history.');
        navigate('/orders');
    };

    // Redirect if not logged in
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isCartCheckout && !item) return <div>Loading...</div>;
    if (isCartCheckout && cart.length === 0) return <Navigate to="/cart" />;

    const displayItems = isCartCheckout ? cart : [item];
    const displayTotal = isCartCheckout ? cartTotal : item.price;
    const hasProducts = displayItems.some(i => i.type === 'product');

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">
                {isCartCheckout ? 'Checkout' : (hasProducts ? 'Complete Your Order' : 'Event Registration')}
            </h1>

            {/* Order Items Preview */}
            <div className="mb-8 space-y-4">
                {displayItems.map((displayItem, idx) => (
                    <div key={`${displayItem.id}-${idx}`} className="card-eco flex gap-4">
                        <img
                            src={displayItem.image}
                            alt={displayItem.name}
                            className="w-24 h-24 object-cover rounded"
                        />
                        <div>
                            <h2 className="text-xl font-bold">{displayItem.name}</h2>
                            <p className="text-eco-green font-bold">${displayItem.price}</p>
                        </div>
                    </div>
                ))}

                <div className="border-t pt-4 mt-4 flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <span className="text-xl font-bold">Total Amount</span>
                    <span className="text-2xl font-bold text-eco-green">${displayTotal.toFixed(2)}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2 font-bold">Full Name</label>
                    <input
                        type="text"
                        required
                        defaultValue={user.name}
                        className="w-full p-2 border rounded focus:border-eco-green focus:ring-1 focus:ring-eco-green outline-none"
                    />
                </div>

                <div>
                    <label className="block mb-2 font-bold">Email</label>
                    <input
                        type="email"
                        required
                        defaultValue={user.email}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100 text-gray-600 cursor-not-allowed outline-none"
                    />
                </div>

                {hasProducts && (
                    <div>
                        <label className="block mb-2 font-bold">Shipping Address</label>
                        <textarea
                            required
                            className="w-full p-2 border rounded focus:border-eco-green focus:ring-1 focus:ring-eco-green outline-none"
                            rows="3"
                        ></textarea>
                    </div>
                )}

                <button type="submit" className="btn-eco w-full">
                    {hasProducts ? 'Place Order' : 'Confirm Registration'}
                </button>
            </form>
        </div>
    );
}

export default BookingPage;
