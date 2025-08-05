"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/translation-context';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import ProductModal from './ProductModal';

export default function ProductsTable({ products, onUpdate }) {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowModal(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm(t('admin.confirm_delete'))) {
            try {
                const response = await fetch(`/api/admin/products/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    onUpdate();
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                    {t('admin.products')} ({products.length})
                </h3>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdd}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus size={16} className="mr-2" />
                    {t('admin.add_product')}
                </motion.button>
            </div>

            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('common.image')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('common.name')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('common.price')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('common.category')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stock & Sizes
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('common.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <AnimatePresence mode="wait">
                            {products.map((product) => (
                                <motion.tr
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                        <Eye size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            {(product.images && product.images.length > 1) && (
                                                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    +{product.images.length - 1} more
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {product.name}
                                        </div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">
                                            {product.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${product.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {product.category}
                                            </span>
                                            {product.stoneColor && (
                                                <div className="text-xs text-gray-500">
                                                    💎 {product.stoneColor}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    product.inStock 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                                                </span>
                                            </div>
                                            {product.availableRingSizes && product.availableRingSizes.length > 0 && (
                                                <div className="text-xs text-gray-500">
                                                    🔢 Sizes: {product.availableRingSizes.join(', ')}
                                                </div>
                                            )}
                                            {product.numberOfRings > 0 && (
                                                <div className="text-xs text-gray-500">
                                                    💍 {product.numberOfRings} Ring{product.numberOfRings > 1 ? 's' : ''}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleEdit(product)}
                                            className="text-blue-600 hover:text-blue-900 p-1"
                                        >
                                            <Edit size={16} />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDelete(product.id)}
                                            className="text-red-600 hover:text-red-900 p-1"
                                        >
                                            <Trash2 size={16} />
                                        </motion.button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>

                {products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">{t('products.no_products')}</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showModal && (
                    <ProductModal
                        product={editingProduct}
                        onClose={() => setShowModal(false)}
                        onSave={() => {
                            setShowModal(false);
                            onUpdate();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}