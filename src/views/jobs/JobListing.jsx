import React, { useState, useEffect } from 'react';
import { getJobs } from '../../api';
import { Search, Loader2, Filter, X, MapPin, DollarSign, Briefcase, Trash2, Sparkles, AlertCircle, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../../components/jobs/JobCard';
import ApplyJobModal from '../../components/jobs/ApplyJobModal';
import { useAuth } from '../../context/AuthContext';


const JobListing = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchingJobs, setFetchingJobs] = useState(false);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [total, setTotal] = useState(0);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const { user } = useAuth();


    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit] = useState(9);

    const [appliedFilters, setAppliedFilters] = useState({
        job_type: '',
        location: '',
        salary_min: '',
        salary_max: '',
        tags: [],
        company_id: searchParams.get('company_id') || ''
    });

    const [pendingFilters, setPendingFilters] = useState({
        job_type: '',
        location: '',
        salary_min: '',
        salary_max: '',
        tags: [],
        company_id: searchParams.get('company_id') || ''
    });

    useEffect(() => {
        const companyId = searchParams.get('company_id') || '';
        setAppliedFilters(prev => ({ ...prev, company_id: companyId }));
        setPendingFilters(prev => ({ ...prev, company_id: companyId }));
    }, [searchParams]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        fetchJobs();
    }, [debouncedSearch, appliedFilters, page]);

    const fetchJobs = async () => {
        try {
            setFetchingJobs(true);
            const params = {
                search: debouncedSearch || undefined,
                job_type: appliedFilters.job_type || undefined,
                location: appliedFilters.location || undefined,
                salary_min: appliedFilters.salary_min || undefined,
                salary_max: appliedFilters.salary_max || undefined,
                tags: appliedFilters.tags.length > 0 ? appliedFilters.tags : undefined,
                company_id: appliedFilters.company_id || undefined,
                page: page,
                limit: limit,
                is_active: true // Only show active jobs to seekers
            };
            const response = await getJobs(params);
            if (response.data && response.data.data) {
                setJobs(response.data.data.jobs || []);
                setTotal(response.data.data.total || 0);
            }
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to load jobs. Please try again.');
        } finally {
            setFetchingJobs(false);
            setLoading(false);
        }
    };

    const handleOpenFilters = () => {
        setPendingFilters(appliedFilters);
        setShowFilters(true);
    };

    const handleApplyFilters = () => {
        setAppliedFilters(pendingFilters);
        setPage(1); // Reset to first page on filter change
        setShowFilters(false);
    };

    const handleResetFilters = () => {
        const resetData = { job_type: '', location: '', salary_min: '', salary_max: '', tags: [], company_id: '' };
        setPendingFilters(resetData);
        setAppliedFilters(resetData);
        setSearchQuery('');
        setPage(1);
        setSearchParams({}); // Clear search params from URL
        setShowFilters(false);
    };

    const handleApplyClick = (job) => {
        if (!user) {
            window.location.href = '/login';
            return;
        }
        if (user.role === 'recruiter') {
            alert('Recruiters cannot apply for jobs.');
            return;
        }
        setSelectedJob(job);
        setIsApplyModalOpen(true);
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

    const totalPages = Math.ceil(total / limit);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="animate-spin text-primary" size={64} />
                <p className="text-gray-400 font-medium animate-pulse">Scanning the job market...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl">
            {/* Header Content */}
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between items-start gap-6">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-primary/10">Browse Careers</span>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold uppercase tracking-widest">
                            <TrendingUp size={14} className="text-emerald-500" />
                            {total} Opportunities Found
                        </div>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 leading-tight">Find Your Next <span className="text-primary italic underline underline-offset-8">Career Leap</span></h1>
                    <p className="text-gray-500 font-medium mt-4 text-lg">Browse vetted opportunities from top-tier companies. Your future starts with a single click.</p>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
                <div className="relative group w-full md:flex-grow">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-all duration-300" size={24} />
                    <input 
                        type="text"
                        placeholder="Search by title, company, or keywords..."
                        className="input-field pl-14 h-16 w-full shadow-lg shadow-gray-100 hover:shadow-xl focus:shadow-primary/5 transition-all text-lg font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
                    <button 
                        onClick={handleOpenFilters}
                        className={`h-16 px-6 border rounded-2xl flex items-center justify-center gap-3 transition-all relative overflow-hidden group/btn ${getActiveFiltersCount() > 0 ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-white text-gray-900 border-gray-100 hover:border-primary hover:text-primary'}`}
                    >
                        <Filter size={24} />
                        <span className="font-extrabold text-sm uppercase tracking-widest">Filters</span>
                        {getActiveFiltersCount() > 0 && (
                            <span className="bg-white text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-sm">
                                {getActiveFiltersCount()}
                            </span>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-center"></div>
                    </button>
                    
                    <button 
                        onClick={handleResetFilters}
                        className="h-16 px-6 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all font-bold uppercase tracking-widest text-xs flex items-center gap-2 group"
                    >
                        <Trash2 size={18} className="group-hover:rotate-12 transition-transform" />
                        Reset
                    </button>
                </div>
            </div>

            {/* Jobs List */}
            {fetchingJobs && jobs.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white border border-gray-100 rounded-[2rem] p-7 h-[280px] animate-pulse flex flex-col gap-5">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
                                    <div className="space-y-2">
                                        <div className="h-3 w-20 bg-gray-100 rounded"></div>
                                        <div className="h-4 w-24 bg-gray-50 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="w-8 h-8 bg-gray-50 rounded-full"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 w-16 bg-gray-50 rounded"></div>
                                <div className="h-6 w-3/4 bg-gray-100 rounded-lg"></div>
                            </div>
                            <div className="h-12 w-full bg-gray-50 rounded-xl"></div>
                            <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between">
                                <div className="h-3 w-20 bg-gray-50 rounded"></div>
                                <div className="h-3 w-12 bg-gray-50 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : jobs.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {jobs.map(job => (
                            <JobCard key={job.id} job={job} onClick={() => handleApplyClick(job)} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 bg-white/50 backdrop-blur-md p-2 rounded-[2.5rem] border border-gray-100/50 w-fit mx-auto shadow-2xl shadow-gray-100">
                            <button 
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={page === 1}
                                className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            
                            <div className="flex items-center gap-2 px-2">
                                {[...Array(totalPages)].map((_, i) => (
                                    <button 
                                        key={i + 1}
                                        onClick={() => setPage(i + 1)}
                                        className={`w-12 h-12 rounded-2xl text-sm font-black transition-all ${page === i + 1 ? 'bg-primary text-white shadow-xl shadow-primary/30 ring-4 ring-primary/10' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={page === totalPages}
                                className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="glass-card p-32 flex flex-col items-center justify-center text-center space-y-10 relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
                    
                    <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-300 relative z-10 transition-transform hover:scale-110 duration-500 shadow-inner">
                        <Search size={56} />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <h3 className="text-4xl font-black text-gray-900">No Matches Found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto text-xl font-medium leading-relaxed">We couldn't find any opportunities matching your current search criteria. Try broadening your scope.</p>
                    </div>
                    <button 
                        onClick={handleResetFilters}
                        className="btn-primary group px-12 py-5 text-lg relative z-10 shadow-2xl shadow-primary/20 hover:shadow-primary/40 flex items-center gap-3"
                    >
                        <Trash2 size={24} className="group-hover:rotate-12 transition-transform" />
                        Clear All Filters
                    </button>
                </div>
            )}

            {/* Filter Drawer */}
            <AnimatePresence>
                {showFilters && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFilters(false)}
                            className="fixed inset-0 bg-gray-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative bg-white w-full max-w-md h-full shadow-[0_0_100px_rgba(0,0,0,0.1)] flex flex-col pt-12 border-l border-gray-100"
                        >
                            <div className="px-10 flex items-center justify-between mb-12">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">Filters</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Refine your search</p>
                                </div>
                                <button 
                                    onClick={() => setShowFilters(false)}
                                    className="p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all border border-gray-100"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="px-10 flex-1 overflow-y-auto space-y-10 pb-10">
                                {/* Job Type */}
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
                                            <Briefcase size={16} className="text-primary" />
                                            Employment Type
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['full_time', 'part_time', 'remote', 'intern'].map(type => (
                                            <button 
                                                key={type}
                                                onClick={() => setPendingFilters(prev => ({ ...prev, job_type: prev.job_type === type ? '' : type }))}
                                                className={`py-4 px-4 rounded-2xl text-xs font-bold border transition-all ${pendingFilters.job_type === type ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                {type.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="space-y-5">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
                                        <MapPin size={16} className="text-primary" />
                                        Location
                                    </label>
                                    <div className="relative group">
                                        <input 
                                            type="text" 
                                            placeholder="City or Remote"
                                            className="input-field h-16 pl-6 pr-14 focus:ring-4 focus:ring-primary/5 text-lg font-medium"
                                            value={pendingFilters.location}
                                            onChange={(e) => setPendingFilters(prev => ({ ...prev, location: e.target.value }))}
                                        />
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 group-focus-within:text-primary transition-colors">
                                            <MapPin size={24} />
                                        </div>
                                    </div>
                                </div>

                                {/* Salary Range */}
                                <div className="space-y-5">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[2px] flex items-center gap-2">
                                        <DollarSign size={16} className="text-primary" />
                                        Annual Salary (₹)
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Minimum</span>
                                            <input 
                                                type="number" 
                                                placeholder="0"
                                                className="input-field h-16 px-6 focus:ring-4 focus:ring-primary/5 text-lg font-bold"
                                                value={pendingFilters.salary_min}
                                                onChange={(e) => setPendingFilters(prev => ({ ...prev, salary_min: e.target.value }))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Maximum</span>
                                            <input 
                                                type="number" 
                                                placeholder="Any"
                                                className="input-field h-16 px-6 focus:ring-4 focus:ring-primary/5 text-lg font-bold"
                                                value={pendingFilters.salary_max}
                                                onChange={(e) => setPendingFilters(prev => ({ ...prev, salary_max: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button 
                                        onClick={handleResetFilters}
                                        className="w-full py-5 border border-red-50 text-red-500 font-extrabold rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
                                    >
                                        <Trash2 size={20} />
                                        Reset All Filters
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-10 border-t border-gray-100 bg-white/50 backdrop-blur-xl">
                                <button 
                                    onClick={handleApplyFilters}
                                    className="btn-primary w-full py-6 text-xl shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 font-black"
                                >
                                    <Filter size={24} />
                                    Show Matching Jobs
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ApplyJobModal 
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                job={selectedJob}
            />
        </div>
    );
};

export default JobListing;
