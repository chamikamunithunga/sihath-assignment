import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { itemService, productService, workshopService, eventService } from '../services/api';
import AdminItemForm from '../components/AdminItemForm';
import { Plus, Edit, Trash2, Package, Calendar, Ticket } from 'lucide-react';

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products');
    const [data, setData] = useState({ products: [], workshops: [], events: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        // Simple role check
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const allData = await itemService.getAllItems();
            setData({
                products: allData.products || [],
                workshops: allData.workshops || [],
                events: allData.events || []
            });
            setError(null);
        } catch (err) {
            console.error("Failed to fetch admin data", err);
            setError("Failed to load dashboard data. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const service = type === 'product' ? productService : type === 'workshop' ? workshopService : eventService;
            await service.delete(id);
            fetchData(); // Refresh
        } catch (err) {
            alert("Failed to delete item");
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            const type = activeTab.slice(0, -1); // 'products' -> 'product'
            const service = type === 'product' ? productService : type === 'workshop' ? workshopService : eventService;

            if (editingItem) {
                await service.update(editingItem._id || editingItem.id, formData);
            } else {
                await service.create(formData);
            }

            setShowForm(false);
            setEditingItem(null);
            fetchData();
        } catch (err) {
            alert("Failed to save item. Check console for details.");
            console.error(err);
        }
    };

    const startEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div></div>;

    const currentItems = data[activeTab] || [];

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 border-l-4 border-green-500 pl-4">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage your community's products, workshops, and events.</p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setShowForm(true); }}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700 shadow-md transition-all"
                >
                    <Plus size={20} />
                    <span>Add New {activeTab.slice(0, -1)}</span>
                </button>
            </header>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border-l-4 border-red-500">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`pb-4 px-4 flex items-center space-x-2 transition-all ${activeTab === 'products' ? 'border-b-2 border-green-500 text-green-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Package size={18} />
                    <span>Products</span>
                </button>
                <button
                    onClick={() => setActiveTab('workshops')}
                    className={`pb-4 px-4 flex items-center space-x-2 transition-all ${activeTab === 'workshops' ? 'border-b-2 border-green-500 text-green-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Calendar size={18} />
                    <span>Workshops</span>
                </button>
                <button
                    onClick={() => setActiveTab('events')}
                    className={`pb-4 px-4 flex items-center space-x-2 transition-all ${activeTab === 'events' ? 'border-b-2 border-green-500 text-green-600 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <Ticket size={18} />
                    <span>Events</span>
                </button>
            </div>

            {/* Form Modal Overlay */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <AdminItemForm
                            type={activeTab.slice(0, -1)}
                            item={editingItem}
                            onSubmit={handleFormSubmit}
                            onCancel={() => { setShowForm(false); setEditingItem(null); }}
                        />
                    </div>
                </div>
            )}

            {/* Items List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Item</th>
                            <th className="px-6 py-4 font-semibold">Details</th>
                            <th className="px-6 py-4 font-semibold">Price</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentItems.map(item => (
                            <tr key={item._id || item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-4">
                                        <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                                        <span className="font-bold text-gray-900">{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600 max-w-xs truncate">
                                        {item.date ? `${item.date} • ${item.time}` : item.description}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-green-600">${item.price}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => startEdit(item)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id || item.id, activeTab.slice(0, -1))}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {currentItems.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No {activeTab} found. Click the button above to add one.
                    </div>
                )}
            </div>
        </div>
    );
}
