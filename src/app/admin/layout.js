"use client";
import { AdminAuthProvider } from '@/lib/admin-auth';
import AdminGuard from '@/components/admin/AdminGuard';

export default function AdminLayout({ children }) {
    return (
        <AdminAuthProvider>
            <AdminGuard>
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </div>
            </AdminGuard>
        </AdminAuthProvider>
    );
}