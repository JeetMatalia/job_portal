import React, { useState, useEffect } from 'react';
import { getMyApplications, deleteApplication } from '../../../services/api';
import { 
    Briefcase, 
    MapPin, 
    Calendar, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    ChevronRight, 
    Building2, 
    RefreshCcw,
    Search,
    Trash2,
    AlertTriangle,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, jobTitle, isDeleting }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm relative z-10 border border-gray-100 overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-orange-500" />
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="text-center">
                            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-inner">
                                <AlertTriangle className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Withdraw Application?</h3>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                Are you sure you want to withdraw your application for <span className="font-bold text-gray-900">"{jobTitle}"</span>? This action cannot be undone.
                            </p>
                            
                            <div className="flex flex-col space-y-3">
                                <button 
                                    onClick={onConfirm}
                                    disabled={isDeleting}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 font-bold text-white shadow-lg shadow-rose-200 transition-all active:scale-95 transform disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isDeleting ? (
                                        <RefreshCcw className="w-5 h-5 animate-spin mr-2" />
                                    ) : (
                                        <Trash2 className="w-5 h-5 mr-2" />
                                    )}
                                    {isDeleting ? 'Withdrawing...' : 'Yes, Withdraw'}
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Keep Application
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const MyApplicationsPage = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Delete Modal State
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, application: null });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await getMyApplications();
            setApplications(response.data.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching applications:', err);
            setError('Failed to load your applications. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.application) return;

        try {
            setIsDeleting(true);
            await deleteApplication(deleteModal.application.id);
            toast.success('Application withdrawn successfully');
            setApplications(prev => prev.filter(app => app.id !== deleteModal.application.id));
            setDeleteModal({ isOpen: false, application: null });
        } catch (err) {
            console.error('Error deleting application:', err);
            toast.error(err.response?.data?.message || 'Failed to withdraw application');
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'accepted':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'rejected':
                return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'reviewed':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'accepted':
                return <CheckCircle2 className="w-4 h-4 mr-1.5" />;
            case 'rejected':
                return <XCircle className="w-4 h-4 mr-1.5" />;
            case 'pending':
                return <Clock className="w-4 h-4 mr-1.5" />;
            case 'reviewed':
                return <RefreshCcw className="w-4 h-4 mr-1.5" />;
            default:
                return <Clock className="w-4 h-4 mr-1.5" />;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-medium italic">Curating your applications...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto mt-12 p-8 bg-rose-50 border border-rose-100 rounded-2xl text-center">
                <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-rose-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-rose-600 mb-6">{error}</p>
                <button 
                    onClick={fetchApplications}
                    className="px-6 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all font-semibold"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 pb-24">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                    My <span className="text-primary italic underline underline-offset-8">Applications</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl">
                    Track the progress of your career journey. You have applied to {applications.length} positions.
                </p>
            </div>

            {applications.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Your dream job is waiting for you. Start exploring opportunities and submit your first application.
                    </p>
                    <a href="/jobs" className="btn-primary inline-flex items-center">
                        Browse Available Jobs
                        <ChevronRight className="w-5 h-5 ml-2" />
                    </a>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.map((app) => (
                        <div 
                            key={app.id} 
                            className="group bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-primary/20 relative overflow-hidden"
                        >
                            {/* Status Accent Bar */}
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${
                                app.application_status === 'accepted' ? 'bg-emerald-500' : 
                                app.application_status === 'rejected' ? 'bg-rose-500' :
                                app.application_status === 'pending' ? 'bg-amber-500' : 'bg-primary'
                            }`} />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between md:justify-start gap-4 mb-3">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                                {app.job.title}
                                            </h3>
                                            <div className="flex items-center text-gray-500 mt-1">
                                                <Building2 className="w-4 h-4 mr-1.5" />
                                                <span className="font-medium">{app.job.company.name}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center space-x-2 md:hidden">
                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(app.application_status)}`}>
                                                {getStatusIcon(app.application_status)}
                                                {app.application_status}
                                            </div>
                                            <button 
                                                onClick={() => setDeleteModal({ isOpen: true, application: app })}
                                                className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6">
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                            {app.job.location}
                                        </div>
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                            Applied {formatDate(app.created_at)}
                                        </div>
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                                            {app.job.job_type.replace('_', ' ')}
                                        </div>
                                    </div>
                                    
                                    {app.cover_letter && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Pitch</p>
                                            <p className="text-sm text-gray-600 italic line-clamp-2">"{app.cover_letter}"</p>
                                        </div>
                                    )}
                                </div>
                                <div className="hidden md:flex flex-col items-end gap-3">
                                    <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(app.application_status)}`}>
                                        {getStatusIcon(app.application_status)}
                                        {app.application_status}
                                    </div>
                                    <button 
                                        onClick={() => setDeleteModal({ isOpen: true, application: app })}
                                        className="inline-flex items-center text-sm font-semibold text-gray-400 hover:text-rose-500 transition-colors group/btn"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1.5" />
                                        Withdraw Application
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <DeleteConfirmationModal 
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, application: null })}
                onConfirm={handleDelete}
                jobTitle={deleteModal.application?.job?.title}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default MyApplicationsPage;
