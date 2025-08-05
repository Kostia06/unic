"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/translation-context';
import { X, Upload, Plus, Trash2, Image as ImageIcon, Camera } from 'lucide-react';
import { JEWELRY_CATEGORIES, STONE_COLORS } from '@/lib/types';

export default function ProductModal({ product, onClose, onSave }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        stoneColor: '',
        numberOfRings: 0,
        image: '',
        images: [],
        availableRingSizes: [1],
        inStock: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadingImages, setUploadingImages] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                price: product.price || '',
                description: product.description || '',
                category: product.category || '',
                stoneColor: product.stoneColor || '',
                numberOfRings: product.numberOfRings || 0,
                image: product.image || '',
                images: product.images || [],
                availableRingSizes: product.availableRingSizes || [1],
                inStock: product.inStock ?? true
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = async (files) => {
        setUploadingImages(true);
        try {
            const uploadedImages = [];
            
            for (const file of files) {
                const formData = new FormData();
                formData.append('file', file);
                
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                
                if (response.ok) {
                    const data = await response.json();
                    uploadedImages.push(data.url);
                } else {
                    throw new Error('Failed to upload image');
                }
            }
            
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...uploadedImages],
                image: prev.image || uploadedImages[0] // Set first image as main if no main image
            }));
        } catch (error) {
            setError('Failed to upload images: ' + error.message);
        } finally {
            setUploadingImages(false);
        }
    };

    const removeImage = (index) => {
        setFormData(prev => {
            const newImages = prev.images.filter((_, i) => i !== index);
            return {
                ...prev,
                images: newImages,
                image: prev.image === prev.images[index] ? (newImages[0] || '') : prev.image
            };
        });
    };

    const setAsMainImage = (imageUrl) => {
        setFormData(prev => ({
            ...prev,
            image: imageUrl
        }));
    };

    const addRingSize = () => {
        setFormData(prev => {
            const maxSize = Math.max(...prev.availableRingSizes, 0);
            if (maxSize < 3) {
                return {
                    ...prev,
                    availableRingSizes: [...prev.availableRingSizes, maxSize + 1].sort((a, b) => a - b)
                };
            }
            return prev;
        });
    };

    const removeRingSize = (size) => {
        setFormData(prev => ({
            ...prev,
            availableRingSizes: prev.availableRingSizes.filter(s => s !== size)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = product 
                ? `/api/admin/products/${product.id}`
                : '/api/admin/products';
            
            const method = product ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                onSave();
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Error saving product');
            }
        } catch (error) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {product ? t('admin.edit_product') : t('admin.add_product')}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md"
                    >
                        <p className="text-sm text-red-600">{error}</p>
                    </motion.div>
                )}

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-6">
                    {['basic', 'images', 'sizes'].map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                                activeTab === tab
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {tab === 'basic' && '📋 Basic Info'}
                            {tab === 'images' && '🖼️ Images'}
                            {tab === 'sizes' && '💍 Ring Sizes'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence mode="wait">
                        {activeTab === 'basic' && (
                            <motion.div
                                key="basic"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            ✨ {t('common.name')}
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., Elegant Gold Ring"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            💰 {t('common.price')} (USD)
                                        </label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            step="0.01"
                                            min="0"
                                            required
                                            placeholder="99.99"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            📂 {t('common.category')}
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">Select category</option>
                                            {Object.values(JEWELRY_CATEGORIES).map(category => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            💎 Stone Color
                                        </label>
                                        <select
                                            name="stoneColor"
                                            value={formData.stoneColor}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="">Select stone color</option>
                                            {Object.values(STONE_COLORS).map(color => (
                                                <option key={color} value={color}>
                                                    {color}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        📝 {t('common.description')}
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Describe the jewelry piece in detail..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                    />
                                </div>

                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        name="inStock"
                                        checked={formData.inStock}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="text-sm font-medium text-gray-900">
                                        ✅ In Stock & Available for Purchase
                                    </label>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'images' && (
                            <motion.div
                                key="images"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        📸 Product Images
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Upload multiple high-quality images of your jewelry piece
                                    </p>
                                </div>

                                {/* Image Upload Area */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(Array.from(e.target.files))}
                                        className="hidden"
                                        id="image-upload"
                                        disabled={uploadingImages}
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer flex flex-col items-center space-y-3"
                                    >
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Camera className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium text-gray-900">
                                                {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                PNG, JPG, WEBP up to 10MB each
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                {/* Current Images */}
                                {formData.images.length > 0 && (
                                    <div>
                                        <h4 className="text-md font-semibold text-gray-800 mb-4">
                                            Current Images ({formData.images.length})
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {formData.images.map((imageUrl, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={imageUrl}
                                                        alt={`Product ${index + 1}`}
                                                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                                                    />
                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all flex items-center justify-center">
                                                        <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => setAsMainImage(imageUrl)}
                                                                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                                                title="Set as main image"
                                                            >
                                                                <ImageIcon className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                                                title="Remove image"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {formData.image === imageUrl && (
                                                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                                            Main
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Main Image URL Input (backup) */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        🔗 Or paste image URL
                                    </label>
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'sizes' && (
                            <motion.div
                                key="sizes"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        💍 Ring Sizes & Variants
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Configure available ring sizes (1, 2, or 3 rings) and quantity
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        🔢 Total Number of Rings
                                    </label>
                                    <input
                                        type="number"
                                        name="numberOfRings"
                                        value={formData.numberOfRings}
                                        onChange={handleChange}
                                        min="0"
                                        max="3"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Total rings in this jewelry piece (0-3)
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-md font-semibold text-gray-800">
                                            Available Ring Sizes
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={addRingSize}
                                            disabled={formData.availableRingSizes.length >= 3}
                                            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add Size</span>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        {[1, 2, 3].map((size) => {
                                            const isSelected = formData.availableRingSizes.includes(size);
                                            return (
                                                <div
                                                    key={size}
                                                    className={`relative p-6 border-2 rounded-lg text-center transition-all cursor-pointer ${
                                                        isSelected
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            removeRingSize(size);
                                                        } else {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                availableRingSizes: [...prev.availableRingSizes, size].sort((a, b) => a - b)
                                                            }));
                                                        }
                                                    }}
                                                >
                                                    <div className="text-2xl mb-2">
                                                        {size === 1 && '💍'}
                                                        {size === 2 && '💍💍'}
                                                        {size === 3 && '💍💍💍'}
                                                    </div>
                                                    <p className="font-semibold text-gray-800">
                                                        Size {size}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {size} Ring{size > 1 ? 's' : ''}
                                                    </p>
                                                    {isSelected && (
                                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-xs">✓</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {formData.availableRingSizes.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            <p>No ring sizes selected</p>
                                            <p className="text-sm">Click on a size above to add it</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        <div className="flex space-x-2">
                            {activeTab !== 'basic' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const tabs = ['basic', 'images', 'sizes'];
                                        const currentIndex = tabs.indexOf(activeTab);
                                        setActiveTab(tabs[currentIndex - 1]);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    ← Previous
                                </button>
                            )}
                            {activeTab !== 'sizes' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const tabs = ['basic', 'images', 'sizes'];
                                        const currentIndex = tabs.indexOf(activeTab);
                                        setActiveTab(tabs[currentIndex + 1]);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Next →
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                            >
                                {t('common.cancel')}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={loading || uploadingImages}
                                className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
                            >
                                {loading ? '⏳ Saving...' : uploadingImages ? '📷 Uploading...' : `✨ ${t('common.save')}`}
                            </motion.button>
                        </div>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}