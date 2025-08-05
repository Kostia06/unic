"use client";
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/translation-context';
import { useAdminAuth } from '@/lib/admin-auth';
import { LogOut, Settings, User } from 'lucide-react';

export default function AdminNavbar() {
    const { t, language, setLanguage } = useTranslation();
    const { admin, logout } = useAdminAuth();

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-shrink-0"
                        >
                            <h1 className="text-xl font-bold text-gray-900">
                                UNIC México Admin
                            </h1>
                        </motion.div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="inline-flex rounded-md shadow-sm" role="group">
                            <button 
                                onClick={() => setLanguage('es')} 
                                className={`px-3 py-1 text-sm font-medium border border-gray-200 rounded-l-lg hover:bg-gray-100 
                                    ${language === 'es' ? 'bg-blue-500 text-white' : 'bg-white text-gray-900'}`}
                            >
                                ES
                            </button>
                            <button 
                                onClick={() => setLanguage('en')} 
                                className={`px-3 py-1 text-sm font-medium border border-gray-200 rounded-r-lg hover:bg-gray-100 
                                    ${language === 'en' ? 'bg-blue-500 text-white' : 'bg-white text-gray-900'}`}
                            >
                                EN
                            </button>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-700">
                            <User size={16} />
                            <span className="text-sm">{admin?.name || admin?.email}</span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={logout}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <LogOut size={16} className="mr-2" />
                            {t('admin.logout')}
                        </motion.button>
                    </div>
                </div>
            </div>
        </nav>
    );
}