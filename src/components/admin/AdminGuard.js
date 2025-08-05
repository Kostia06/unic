"use client";
import { useAdminAuth } from '@/lib/admin-auth';
import { useTranslation } from '@/lib/translation-context';
import AdminLogin from './AdminLogin';

export default function AdminGuard({ children }) {
    const { isAuthenticated, loading } = useAdminAuth();
    const { t } = useTranslation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AdminLogin />;
    }

    return children;
}