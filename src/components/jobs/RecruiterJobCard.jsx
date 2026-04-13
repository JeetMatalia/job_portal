import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Briefcase, DollarSign, Calendar, Users, ChevronRight, MoreVertical, ChevronUp, ChevronDown, FileText, Trash2, Loader2 } from 'lucide-react';

const RecruiterJobCard = ({ job, onClick, onEdit, onDelete, isDeleting }) => {
    // Format salary with commas and k/Lakh representation
    const formatSalary = (val) => {
        if (!val) return '0';
        if (val >= 100000) return (val / 100000).toFixed(1) + 'L';
        if (val >= 1000) return (val / 1000).toFixed(0) + 'k';
        return val;
    };

    const formatDate = (dateString) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const [showAllTags, setShowAllTags] = useState(false);
    const visibleTags = showAllTags ? job.tags : job.tags.slice(0, 5);
    const remainingCount = job.tags.length - 5;

    return (
        <motion.div 
            whileHover={isDeleting ? {} : { y: -5 }}
            className={`group relative bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all h-full flex flex-col justify-between ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
        >
            <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold uppercase tracking-widest border border-primary/10">
                            {job.job_type.replace('_', ' ')}
                        </span>
                        {job.is_active ? (
                            <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold uppercase tracking-widest border border-green-100 flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                Live
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-xs font-bold uppercase tracking-widest border border-gray-100">
                                Inactive
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(job); }}
                            className="p-2 bg-gray-50 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                            title="Edit Job"
                            disabled={isDeleting}
                        >
                            <FileText size={18} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(job.id); }}
                            className="p-2 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all"
                            title="Delete Job"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate group-hover:text-primary transition-colors">
                    {job.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-6">
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                        <MapPin size={16} />
                        {job.location}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                        <DollarSign size={16} />
                        {formatSalary(job.salary_min)} - {formatSalary(job.salary_max)}
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6 min-h-[30px]">
                    <AnimatePresence initial={false}>
                        {visibleTags.map((tag, idx) => (
                            <motion.span 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="px-2 py-0.5 bg-gray-50 text-gray-400 rounded-md text-[10px] font-bold uppercase tracking-wider"
                            >
                                {tag}
                            </motion.span>
                        ))}
                        {!showAllTags && job.tags.length > 5 && (
                            <motion.button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAllTags(true);
                                }}
                                className="px-2 py-0.5 bg-primary/5 text-primary rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-primary/10 transition-colors"
                            >
                                +{remainingCount} more
                            </motion.button>
                        )}
                        {showAllTags && job.tags.length > 5 && (
                            <motion.button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowAllTags(false);
                                }}
                                className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
                            >
                                Show Less
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-50 mt-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <Users size={14} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter leading-none">Applicants</p>
                                <p className="text-sm font-bold text-gray-900 leading-none">{job.applicant_count || 0}</p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => onClick(job)}
                        className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default RecruiterJobCard;
