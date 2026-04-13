import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { User, Mail, Shield, Calendar, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { deleteProfile } from '../../../services/api';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';

const ProfilePage = () => {
    const { user, loading, logout } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="text-2xl font-semibold text-gray-700">Please logging in to view your profile.</div>
                <button className="btn-primary" onClick={() => window.location.href = '/login'}>Go to Login</button>
            </div>
        );
    }

    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            await deleteProfile();
            // On success, use the auth context's logout to clear everything and redirect
            await logout();
        } catch (err) {
            console.error('Error deleting account:', err);
            alert(err.response?.data?.message || 'Failed to delete account. Please try again.');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-500 mt-1">Manage your personal information and preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
                {/* Left Column - Profile Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5"></div>
                        <div className="px-6 pb-6 -mt-16 text-center">
                            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-white bg-gray-100 text-primary mb-4 shadow-sm overflow-hidden">
                                <span className="text-4xl font-bold uppercase">
                                    {user.first_name?.[0] || user.email?.[0] || 'U'}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 truncate">
                                {user.first_name} {user.last_name}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
                            <div className="mt-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                    user.role === 'recruiter' 
                                        ? 'bg-blue-100 text-blue-700' 
                                        : 'bg-green-100 text-green-700'
                                }`}>
                                    {user.role?.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Details */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <User className="mr-2 text-primary" size={20} />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                                    <p className="mt-1 text-gray-900 font-medium">{user.first_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                                    <p className="mt-1 text-gray-900 font-medium">{user.last_name || 'N/A'}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                                    <div className="flex items-center mt-1 text-gray-900 font-medium">
                                        <Mail className="mr-2 text-gray-400" size={16} />
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <Shield className="mr-2 text-primary" size={20} />
                                Account Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">User ID</label>
                                    <p className="mt-1 text-gray-600 font-mono text-xs">{user.id}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Role</label>
                                    <p className="mt-1 text-gray-900 font-medium capitalize">{user.role?.replace('_', ' ')}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Member Since</label>
                                    <div className="flex items-center mt-1 text-gray-900 font-medium">
                                        <Calendar className="mr-2 text-gray-400" size={16} />
                                        {formatDate(user.created_at)}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Updated</label>
                                    <div className="flex items-center mt-1 text-gray-900 font-medium">
                                        <Clock className="mr-2 text-gray-400" size={16} />
                                        {formatDate(user.updated_at)}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50/30 rounded-2xl border border-red-100 p-8">
                        <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center">
                            <AlertTriangle className="mr-2" size={20} />
                            Danger Zone
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Once you delete your account, there is no going back. Please be certain. 
                            All your data, applications, and postings will be permanently removed.
                        </p>
                        <button 
                            onClick={() => setShowDeleteModal(true)}
                            className="bg-white border border-red-200 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
                        >
                            <Trash2 size={18} />
                            Close Account Permanently
                        </button>
                    </div>
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => !isDeleting && setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                title="Delete your account?"
                description={<>This will permanently delete your account <span className="font-bold text-gray-900">({user.email})</span> and all associated data. This action cannot be undone.</>}
                confirmText="Verify & Delete Account"
                cancelText="No, Keep My Account"
                loading={isDeleting}
            />
        </div>
    );
};

export default ProfilePage;
