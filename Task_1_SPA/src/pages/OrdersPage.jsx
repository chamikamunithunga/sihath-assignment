import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function OrdersPage() {
    const { user } = useAuth();

    if (!user || !user.orders || user.orders.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="bg-blue-100 p-6 rounded-full mb-6">
                    <span className="text-6xl">📦</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
                <p className="text-gray-600 mb-8 max-w-md">
                    You haven't made any purchases yet. Your eco-friendly journey starts with a single step!
                </p>
                <Link
                    to="/categories"
                    className="bg-eco-green text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-green-700 transition-all transform hover:-translate-y-1"
                >
                    Explore Products
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 flex items-center">
                <span className="mr-3">📦</span> Order History
            </h1>

            <div className="space-y-6">
                {user.orders.map((order) => (
                    <div key={order.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-shadow hover:shadow-lg">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Order #{order.id}</h3>
                                <p className="text-gray-500 text-sm">Placed on {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {order.status || 'Completed'}
                                </span>
                                <span className="text-xl font-bold text-gray-900">${order.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xl">
                                            {/* Fallback icon if no image available for historical data, though we expect images */}
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                                            ) : (
                                                '🌱'
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.name}</p>
                                            <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-gray-600">${item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
