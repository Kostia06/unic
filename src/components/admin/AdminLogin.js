"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdminAuth } from '@/lib/admin-auth';
import { useTranslation } from '@/lib/translation-context';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAdminAuth();
    const { t, language, setLanguage } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(email, password);
        
        if (!result.success) {
            setError(result.error || t('admin.login_error'));
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            {t('admin.login')}
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            UNIC México Admin Panel
                        </p>
                    </div>
                    
                    <div className="flex justify-center mb-4">
                        <div className="inline-flex rounded-md shadow-sm" role="group">
                            <button 
                                onClick={() => setLanguage('es')} 
                                className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg hover:bg-gray-100 
                                    ${language === 'es' ? 'bg-blue-500 text-white' : 'bg-white text-gray-900'}`}
                            >
                                Español
                            </button>
                            <button 
                                onClick={() => setLanguage('en')} 
                                className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-r-lg hover:bg-gray-100 
                                    ${language === 'en' ? 'bg-blue-500 text-white' : 'bg-white text-gray-900'}`}
                            >
                                English
                            </button>
                        </div>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="rounded-md bg-red-50 p-4"
                            >
                                <div className="text-sm text-red-700">{error}</div>
                            </motion.div>
                        )}
                        
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email" className="sr-only">
                                    {t('admin.email')}
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder={t('admin.email')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    {t('admin.password')}
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder={t('admin.password')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? t('common.loading') : t('admin.login')}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}