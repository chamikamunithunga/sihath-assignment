import { useState, useEffect } from 'react';
import { itemService } from '../services/api';
import { Upload, X, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

export default function AdminItemForm({ item, type, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        description: '',
        category: type + 's',
        type: type,
        // Event/Workshop specific
        date: '',
        time: '',
        location: '',
        capacity: '',
        enrolled: 0
    });

    const [uploading, setUploading] = useState(false);
    const [imageMode, setImageMode] = useState('url'); // 'url' or 'upload'
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (item) {
            setFormData({
                ...formData,
                ...item
            });
            setPreviewUrl(item.image);
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'capacity' || name === 'enrolled' ? Number(value) : value
        }));
        if (name === 'image') setPreviewUrl(value);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const { url } = await itemService.uploadImage(file);
            setFormData(prev => ({ ...prev, image: url }));
            setPreviewUrl(url);
        } catch (err) {
            alert('Failed to upload image. Make sure the backend is running.');
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold mb-4">
                {item ? `Edit ${type}` : `Add New ${type}`}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        step="0.01"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image Source</label>
                    <div className="flex space-x-4 mb-4">
                        <button
                            type="button"
                            onClick={() => setImageMode('url')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${imageMode === 'url' ? 'bg-green-50 border-green-500 text-green-700 font-bold' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                        >
                            <LinkIcon size={18} />
                            <span>URL</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setImageMode('upload')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${imageMode === 'upload' ? 'bg-green-50 border-green-500 text-green-700 font-bold' : 'bg-gray-50 border-gray-200 text-gray-600'}`}
                        >
                            <Upload size={18} />
                            <span>Upload from Desktop</span>
                        </button>
                    </div>

                    {imageMode === 'url' ? (
                        <input
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="Enter image URL..."
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                            required={imageMode === 'url'}
                        />
                    ) : (
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={uploading}
                            />
                            {uploading ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-2"></div>
                                    <span className="text-sm text-gray-600">Uploading...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload className="text-gray-400 mb-2" size={32} />
                                    <span className="text-sm text-gray-600 font-medium">Click to upload from your desktop</span>
                                    <span className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</span>
                                </div>
                            )}
                        </div>
                    )}

                    {previewUrl && (
                        <div className="mt-4 relative group">
                            <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded-lg border" />
                            <button
                                type="button"
                                onClick={() => { setFormData(prev => ({ ...prev, image: '' })); setPreviewUrl(''); }}
                                className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="3"
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                    />
                </div>

                {type !== 'product' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                placeholder="e.g. 10:00 AM"
                                required
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 shadow-md transition-all"
                >
                    {item ? 'Update Item' : 'Create Item'}
                </button>
            </div>
        </form>
    );
}
