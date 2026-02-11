import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

export default function CartPage() {
    const { cart, removeFromCart, cartTotal } = useApp();
    const navigate = useNavigate();

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-green-100 p-6 rounded-full mb-6">
                    <span className="text-6xl">🛒</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-8 max-w-md">
                    Looks like you haven't added anything yet. Explore our fresh produce and workshops!
                </p>
                <Link
                    to="/categories"
                    className="bg-eco-green text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-green-700 transition-all transform hover:-translate-y-1"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 flex items-center">
                <span className="mr-3">🛒</span> Your Shopping Cart
            </h1>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="md:col-span-2 space-y-4" role="list" aria-label="Shopping cart items">
                    {cart.map((item, index) => (
                        <article key={`${item.id}-${index}`} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100" role="listitem">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div className="flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                    <p className="text-gray-500 text-sm capitalize">{item.type}</p>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-eco-green font-bold text-lg">${item.price}</span>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium hover:underline"
                                        aria-label={`Remove ${item.name} from cart`}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Order Summary */}
                <aside className="md:col-span-1" aria-labelledby="order-summary-heading">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
                        <h3 id="order-summary-heading" className="text-xl font-bold mb-6">Order Summary</h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal ({cart.length} items)</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between font-bold text-xl text-gray-900">
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/booking/checkout')}
                            className="w-full bg-eco-green text-white py-3 rounded-lg font-bold shadow-md hover:bg-green-700 transition-all transform hover:-translate-y-0.5"
                        >
                            Proceed to Checkout
                        </button>

                        <div className="mt-4 text-center">
                            <Link to="/categories" className="text-sm text-gray-500 hover:text-green-600">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
