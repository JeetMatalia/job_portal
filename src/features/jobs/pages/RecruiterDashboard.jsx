import React, { useState, useEffect } from 'react';
import { getJobs, createJob, getOwnCompany, updateJob, deleteJob } from '../../../services/api';
import { Plus, Briefcase, Search, Loader2, Sparkles, Filter, TrendingUp, Users, AlertCircle, X, MapPin, Trash2, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PostJobModal from '../components/PostJobModal';
import RecruiterJobCard from '../components/RecruiterJobCard';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import JobApplicantsModal from '../components/JobApplicantsModal';

const RecruiterDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState(true);
    const [fetchingJobs, setFetchingJobs] = useState(false);
    const [showPostJobModal, setShowPostJobModal] = useState(false);
    const [isPostingJob, setIsPostingJob] = useState(false);
    const [error, setError] = useState(null);
    const [editingJob, setEditingJob] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null); // Track ID of job being deleted
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [viewingApplicantsJob, setViewingApplicantsJob] = useState(null);
    const [showApplicantsModal, setShowApplicantsModal] = useState(false);

    // Applied Filters (Used for API calls)
    const [appliedFilters, setAppliedFilters] = useState({
        job_type: '',
        location: '',
        salary_min: '',
        salary_max: '',
        tags: []
    });

    // Pending Filters (In UI drawer)
    const [pendingFilters, setPendingFilters] = useState({
        job_type: '',
        location: '',
        salary_min: '',
        salary_max: '',
        tags: []
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const initDashboard = async () => {
            try {
                setLoading(true);
                const companyRes = await getOwnCompany();
                if (companyRes.data && companyRes.data.data) {
                    setCompany(companyRes.data.data);
                }
            } catch (err) {
                console.error('Error initializing dashboard:', err);
                if (err.response?.status === 404) {
                    setError('You need to register a company before accessing the dashboard.');
                } else {
                    setError('Failed to load dashboard data. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        initDashboard();
    }, []);

    useEffect(() => {
        if (company?.id) {
            fetchJobs(company.id, activeFilter, debouncedSearch, appliedFilters);
        }
    }, [company?.id, activeFilter, debouncedSearch, appliedFilters]);

    const handleOpenFilters = () => {
        setPendingFilters(appliedFilters);
        setShowFilters(true);
    };

    const handleApplyFilters = () => {
        setAppliedFilters(pendingFilters);
        setShowFilters(false);
    };

    const handleResetFilters = () => {
        const resetData = { job_type: '', location: '', salary_min: '', salary_max: '', tags: [] };
        setPendingFilters(resetData);
        setAppliedFilters(resetData);
        setSearchQuery('');
        setShowFilters(false);
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (appliedFilters.job_type) count++;
        if (appliedFilters.location) count++;
        if (appliedFilters.salary_min) count++;
        if (appliedFilters.salary_max) count++;
        if (appliedFilters.tags.length > 0) count++;
        return count;
    };

    const fetchJobs = async (companyId, isActive, searchVal, filterData) => {
        try {
            setFetchingJobs(true);
            const params = {
                company_id: companyId,
                is_active: isActive,
                search: searchVal || undefined,
                job_type: filterData.job_type || undefined,
                location: filterData.location || undefined,
                salary_min: filterData.salary_min || undefined,
                salary_max: filterData.salary_max || undefined,
                tags: filterData.tags.length > 0 ? filterData.tags : undefined,
                page: page,
                limit: limit
            };
            const response = await getJobs(params);
            if (response.data && response.data.data) {
                setJobs(response.data.data.jobs || []);
            }
        } catch (err) {
            console.error('Error fetching jobs:', err);
        } finally {
            setFetchingJobs(false);
        }
    };

    const handleJobSubmit = async (jobData) => {
        setIsPostingJob(true);
        try {
            if (editingJob) {
                // Update existing job
                const response = await updateJob(editingJob.id, jobData);
                if (response.data && response.data.data) {
                    const updatedJob = response.data.data;
                    // Update list based on new active status
                    if (updatedJob.is_active === activeFilter) {
                        setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
                    } else {
                        setJobs(prev => prev.filter(j => j.id !== updatedJob.id));
                    }
                    setShowPostJobModal(false);
                    setEditingJob(null);
                }
            } else {
                // Create new job
                const response = await createJob(jobData);
                if (response.data && response.data.data) {
                    if (activeFilter) {
                        setJobs(prev => [response.data.data, ...prev]);
                    }
                    setShowPostJobModal(false);
                }
            }
        } catch (err) {
            console.error('Error saving job:', err);
            alert(err.response?.data?.message || 'Failed to save job. Please try again.');
        } finally {
            setIsPostingJob(false);
        }
    };

    const handleEditClick = (job) => {
        setEditingJob(job);
        setShowPostJobModal(true);
    };

    const handleDeleteClick = (job) => {
        setJobToDelete(job);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!jobToDelete) return;

        try {
            setIsDeleting(jobToDelete.id);
            await deleteJob(jobToDelete.id);
            setJobs(prev => prev.filter(job => job.id !== jobToDelete.id));
            setShowDeleteModal(false);
            setJobToDelete(null);
        } catch (err) {
            console.error('Error deleting job:', err);
            alert(err.response?.data?.message || 'Failed to delete job. Please try again.');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleViewApplicants = (job) => {
        setViewingApplicantsJob(job);
        setShowApplicantsModal(true);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="animate-spin text-primary" size={64} />
                <p className="text-gray-400 font-medium animate-pulse">Building your dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-md mx-auto glass-card p-12 flex flex-col items-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6 font-bold">
                        <AlertCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
                    <a href="/company" className="btn-primary">Go to Company Page</a>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="md:col-span-2 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Recruiter Overview</span>
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                            <Sparkles size={12} className="text-amber-400" />
                            Premium Access
                        </span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900">Welcome, {company?.name}</h1>
                    <p className="text-gray-500 font-medium mt-2">Manage your career opportunities and track applicant progress.</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-lg transition-all group">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold group-hover:scale-110 transition-transform">
                        <Briefcase size={28} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{activeFilter ? 'Active Jobs' : 'Inactive Jobs'}</p>
                        {fetchingJobs ? (
                            <div className="h-8 w-12 bg-gray-100 animate-pulse rounded-lg mt-1"></div>
                        ) : (
                            <p className="text-2xl font-extrabold text-gray-900">{jobs.length}</p>
                        )}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-lg transition-all group">
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 font-bold group-hover:scale-110 transition-transform">
                        <Users size={28} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Applicants</p>
                        {fetchingJobs ? (
                            <div className="h-8 w-16 bg-gray-100 animate-pulse rounded-lg mt-1"></div>
                        ) : (
                            <p className="text-2xl font-extrabold text-gray-900">
                                {jobs.reduce((acc, job) => acc + (job.applicant_count || 0), 0)}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {/* Status Toggle Tabs */}
                    <div className="flex bg-gray-100 p-1.5 rounded-2xl shadow-inner mr-2 shrink-0">
                        <button 
                            onClick={() => setActiveFilter(true)}
                            className={`px-6 h-11 rounded-xl text-sm font-bold transition-all ${activeFilter ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Active
                        </button>
                        <button 
                            onClick={() => setActiveFilter(false)}
                            className={`px-6 h-11 rounded-xl text-sm font-bold transition-all ${!activeFilter ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Inactive
                        </button>
                    </div>

                    <div className="relative group flex-grow md:flex-grow-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder="Search listings..."
                            className="input-field pl-12 h-14 w-full md:w-64 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleOpenFilters}
                        className={`h-14 px-5 border rounded-2xl flex items-center justify-center gap-3 transition-all shadow-sm shrink-0 ${showFilters ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-white text-gray-400 border-gray-100 hover:text-primary hover:border-primary'}`}
                    >
                        <Filter size={20} />
                        <span className="font-bold text-sm">Filters</span>
                        {getActiveFiltersCount() > 0 && (
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${showFilters ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                                {getActiveFiltersCount()}
                            </span>
                        )}
                    </button>
                </div>
                <button 
                    onClick={() => setShowPostJobModal(true)}
                    className="btn-primary h-14 px-8 flex items-center gap-3 w-full md:w-auto justify-center text-lg shadow-xl shadow-primary/20"
                >
                    <Plus size={24} />
                    Post New Opportunity
                </button>
            </div>

            {/* Jobs List */}
            {fetchingJobs ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white border border-gray-100 rounded-[2.5rem] p-8 h-[280px] animate-pulse">
                            <div className="flex justify-between mb-8">
                                <div className="h-6 w-24 bg-gray-100 rounded-full"></div>
                                <div className="h-6 w-16 bg-gray-100 rounded-full"></div>
                            </div>
                            <div className="h-8 w-3/4 bg-gray-100 rounded-xl mb-4"></div>
                            <div className="h-6 w-1/2 bg-gray-50 rounded-lg mb-10"></div>
                            <div className="mt-auto h-12 w-full bg-gray-50 rounded-2xl"></div>
                        </div>
                    ))}
                </div>
            ) : jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
                    {jobs.map(job => (
                        <RecruiterJobCard 
                            key={job.id} 
                            job={job} 
                            onClick={handleViewApplicants}
                            onEdit={handleEditClick}
                            onDelete={() => handleDeleteClick(job)}
                            isDeleting={isDeleting === job.id}
                        />
                    ))}
                </div>
            ) : (
                <div className="glass-card p-24 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
                    
                    <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary/30 relative z-10 transition-transform hover:scale-110">
                        <Briefcase size={48} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-gray-900">Your Talent Pipeline is Empty</h3>
                        <p className="text-gray-500 max-w-sm mt-3 text-lg">Start your recruitment journey by publishing your first job opening to attract top-tier global talent.</p>
                    </div>
                    <button 
                        onClick={() => setShowPostJobModal(true)}
                        className="btn-primary flex items-center gap-3 group px-10 py-5 text-lg relative z-10 shadow-2xl shadow-primary/20 hover:shadow-primary/40"
                    >
                        <Plus size={24} />
                        Launch Your First Post
                    </button>
                </div>
            )}

            <PostJobModal 
                isOpen={showPostJobModal}
                onClose={() => {
                    setShowPostJobModal(false);
                    setEditingJob(null);
                }}
                onSubmit={handleJobSubmit}
                submitting={isPostingJob}
                initialData={editingJob}
            />

            <DeleteConfirmationModal 
                isOpen={showDeleteModal}
                onClose={() => {
                    if (!isDeleting) {
                        setShowDeleteModal(false);
                        setJobToDelete(null);
                    }
                }}
                onConfirm={handleConfirmDelete}
                title="Permanently Delete Listing?"
                description={<>You are about to delete <span className="font-bold text-gray-900">"{jobToDelete?.title}"</span>. This action is irreversible and all applicant data for this post will be lost.</>}
                loading={!!isDeleting}
            />

            <JobApplicantsModal 
                isOpen={showApplicantsModal}
                onClose={() => {
                    setShowApplicantsModal(false);
                    setViewingApplicantsJob(null);
                }}
                job={viewingApplicantsJob}
            />

            {/* Filter Drawer */}
            <AnimatePresence>
                {showFilters && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFilters(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col pt-10"
                        >
                            <div className="px-8 flex items-center justify-between mb-10">
                                <h3 className="text-2xl font-bold text-gray-900">Advanced Filters</h3>
                                <button 
                                    onClick={() => setShowFilters(false)}
                                    className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="px-8 flex-1 overflow-y-auto space-y-8 pb-10">
                                {/* Job Type */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Briefcase size={14} className="text-primary" />
                                            Employment Type
                                        </label>
                                        {pendingFilters.job_type && (
                                            <button 
                                                onClick={() => setPendingFilters(prev => ({ ...prev, job_type: '' }))}
                                                className="text-[10px] font-bold text-primary hover:underline"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['full_time', 'part_time', 'remote', 'intern'].map(type => (
                                            <button 
                                                key={type}
                                                onClick={() => setPendingFilters(prev => ({ ...prev, job_type: type }))}
                                                className={`py-3.5 px-4 rounded-2xl text-xs font-bold border transition-all ${pendingFilters.job_type === type ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                {type.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={14} className="text-primary" />
                                        Preferred Location
                                    </label>
                                    <div className="relative group">
                                        <input 
                                            type="text" 
                                            placeholder="City or Remote"
                                            className="input-field h-14 pl-6 pr-12 focus:ring-4 focus:ring-primary/5"
                                            value={pendingFilters.location}
                                            onChange={(e) => setPendingFilters(prev => ({ ...prev, location: e.target.value }))}
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                                            <MapPin size={18} />
                                        </div>
                                    </div>
                                </div>

                                {/* Salary Range */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <DollarSign size={14} className="text-primary" />
                                        Annual Salary Range
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-tighter block ml-1">Minimum (₹)</span>
                                            <input 
                                                type="number" 
                                                placeholder="0"
                                                className="input-field h-14 px-6 focus:ring-4 focus:ring-primary/5"
                                                value={pendingFilters.salary_min}
                                                onChange={(e) => setPendingFilters(prev => ({ ...prev, salary_min: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-tighter block ml-1">Maximum (₹)</span>
                                            <input 
                                                type="number" 
                                                placeholder="Any"
                                                className="input-field h-14 px-6 focus:ring-4 focus:ring-primary/5"
                                                value={pendingFilters.salary_max}
                                                onChange={(e) => setPendingFilters(prev => ({ ...prev, salary_max: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button 
                                        onClick={handleResetFilters}
                                        className="w-full py-4 border border-red-50 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center gap-2 text-sm"
                                    >
                                        <Trash2 size={18} />
                                        Reset All Search Criteria
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-8 border-t border-gray-100 bg-white/80 backdrop-blur-md">
                                <button 
                                    onClick={handleApplyFilters}
                                    className="btn-primary w-full py-5 text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                                >
                                    <Filter size={20} />
                                    Apply Search Filters
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RecruiterDashboard;
