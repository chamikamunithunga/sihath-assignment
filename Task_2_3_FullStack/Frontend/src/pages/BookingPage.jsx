import { useParams, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { itemService, bookingService } from '../services/api';

function BookingPage() {
    const { id } = useParams(); // id can be 'checkout'
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    // Removed addOrder from AuthContext as we are now using backend
    const { cart, clearCart, cartTotal } = useApp();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const isCartCheckout = id === 'checkout';

    useEffect(() => {
        const fetchItem = async () => {
            if (isCartCheckout) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Fetch all items to populate the booking page with the correct item details
                const allData = await itemService.getAllItems();
                const allItems = allData.all || [...allData.products, ...allData.workshops, ...allData.events];

                // Use loose equality to match string ID from URL with potentially number/string ID from data
                // eslint-disable-next-line eqeqeq
                const found = allItems.find(i => i.id == id);

                if (found) {
                    setItem(found);
                } else {
                    setError('Item not found');
                }
            } catch (err) {
                console.error("Failed to load item for booking", err);
                setError('Failed to load item details');
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id, isCartCheckout]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            if (isCartCheckout) {
                // Create a booking for each item in the cart
                // Note: Ideally backend should handle bulk creation or order object, 
                // but we are mapping to existing Booking model for now.
                const bookingPromises = cart.map(cartItem => {
                    const bookingData = {
                        itemId: cartItem.id,
                        itemType: cartItem.type.charAt(0).toUpperCase() + cartItem.type.slice(1),
                        // You might want to add quantity or other details here if Booking model supports it
                    };
                    return bookingService.create(bookingData);
                });

                await Promise.all(bookingPromises);
                clearCart();
            } else {
                // Single item booking
                const bookingData = {
                    itemId: item.id,
                    itemType: item.type.charAt(0).toUpperCase() + item.type.slice(1)
                };
                await bookingService.create(bookingData);
            }

            alert('Thank you! Your order/registration has been processed successfully.');
            navigate('/orders');
        } catch (err) {
            console.error("Booking failed", err);
            alert(`Booking/Order failed: ${err.response?.data?.message || err.message || 'Unknown error'}`);
        } finally {
            setProcessing(false);
        }
    };

    // Redirect if not logged in
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isCartCheckout) {
        if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div></div>;
        if (error || !item) return <div className="text-center py-20 text-red-500">{error || 'Item not found'}</div>;
    }

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

                <button type="submit" disabled={processing} className="btn-eco w-full disabled:opacity-50 disabled:cursor-not-allowed">
                    {processing ? 'Processing...' : (hasProducts ? 'Place Order' : 'Confirm Registration')}
                </button>
            </form>
        </div>
    );
}

export default BookingPage;
