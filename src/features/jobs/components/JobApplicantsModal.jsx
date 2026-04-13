import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Mail, Clock, FileText, ChevronRight, Loader2, User, Search, AlertCircle, Sparkles } from 'lucide-react';
import { getJobApplications, updateApplicationStatus } from '../../../services/api';

const JobApplicantsModal = ({ isOpen, onClose, job }) => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [updatingIds, setUpdatingIds] = useState([]);

    useEffect(() => {
        if (isOpen && job?.id) {
            fetchApplications();
        } else {
            // Reset state when closing
            setApplications([]);
            setError(null);
            setSearchQuery('');
        }
    }, [isOpen, job?.id]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getJobApplications(job.id);
            if (response.data && response.data.data) {
                setApplications(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching applications:', err);
            setError('Failed to load applicant data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            setUpdatingIds(prev => [...prev, applicationId]);
            await updateApplicationStatus(applicationId, newStatus);
            setApplications(prev => prev.map(app => 
                app.id === applicationId ? { ...app, application_status: newStatus } : app
            ));
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status. Please try again.');
        } finally {
            setUpdatingIds(prev => prev.filter(id => id !== applicationId));
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    const filteredApplications = applications.filter(app => {
        const fullName = `${app.applicant?.first_name} ${app.applicant?.last_name}`.toLowerCase();
        const email = app.applicant?.email.toLowerCase();
        const query = searchQuery.toLowerCase();
        return fullName.includes(query) || email.includes(query);
    });

    if (!isOpen) return null;

    return (
        <AnimatePresence>
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
                    className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl relative z-10 border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary/10 via-purple-500/5 to-primary/5 p-8 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                                    <Users size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                                        Applicants for {job?.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="bg-primary/10 text-primary px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                            {job?.job_type?.replace('_', ' ')}
                                        </span>
                                        <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
                                            <Clock size={12} />
                                            Posted {formatDate(job?.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-3 rounded-2xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Search & Stats */}
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="relative group flex-grow w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                <input 
                                    type="text"
                                    placeholder="Search by name or email..."
                                    className="input-field pl-12 h-14 bg-white/50 backdrop-blur-md"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 px-6 h-14 bg-white/50 rounded-2xl border border-gray-100 backdrop-blur-md shrink-0">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total:</span>
                                <span className="text-xl font-black text-primary">{applications.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 translate-y-10">
                                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                                <p className="text-gray-400 font-medium animate-pulse">Sourcing applicant profiles...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
                                    <AlertCircle size={40} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{error}</h4>
                                <button onClick={fetchApplications} className="btn-primary py-3 px-8 text-sm">Retry Loading</button>
                            </div>
                        ) : filteredApplications.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 pb-4">
                                {filteredApplications.map((app, index) => (
                                    <motion.div 
                                        key={app.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                                                    <User size={32} />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                                                        {app.applicant?.first_name} {app.applicant?.last_name}
                                                    </h4>
                                                    <div className="flex flex-col space-y-1">
                                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                            <Mail size={14} className="text-primary/40" />
                                                            {app.applicant?.email}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                                            <Clock size={12} />
                                                            Applied {formatDate(app.created_at)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col items-end gap-3 self-end md:self-start">
                                                <div className="relative">
                                                    {updatingIds.includes(app.id) && (
                                                        <div className="absolute -left-6 top-1/2 -translate-y-1/2">
                                                            <Loader2 size={16} className="animate-spin text-primary" />
                                                        </div>
                                                    )}
                                                    <select 
                                                        value={app.application_status}
                                                        disabled={updatingIds.includes(app.id)}
                                                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest border outline-none cursor-pointer transition-all hover:shadow-md ${
                                                            app.application_status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                                            app.application_status === 'reviewed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                            app.application_status === 'accepted' ? 'bg-green-50 text-green-600 border-green-100' :
                                                            'bg-red-50 text-red-600 border-red-100'
                                                        }`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="reviewed">Reviewed</option>
                                                        <option value="accepted">Accepted</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {app.cover_letter && (
                                            <div className="mt-6 p-5 bg-gray-50 rounded-2xl border border-gray-100 relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20"></div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FileText size={14} className="text-primary" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cover Letter Overview</span>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed italic">
                                                    "{app.cover_letter}"
                                                </p>
                                            </div>
                                        )}

                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="w-24 h-24 bg-gray-100 rounded-[2rem] flex items-center justify-center text-gray-300 mb-6">
                                    <Users size={48} />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900">No matching candidates found</h4>
                                <p className="text-gray-500 max-w-xs mt-2">Adjust your search or wait for new applications.</p>
                                {searchQuery && (
                                    <button 
                                        onClick={() => setSearchQuery('')}
                                        className="mt-6 text-primary font-bold hover:underline"
                                    >
                                        Clear search filters
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default JobApplicantsModal;
