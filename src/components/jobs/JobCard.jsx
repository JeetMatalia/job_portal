import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, Wallet, Clock, ArrowUpRight } from 'lucide-react';

const JobCard = ({ job, onClick }) => {
    const formatSalary = (val) => {
        if (!val) return '0';
        if (val >= 10000000) return (val / 10000000).toFixed(1) + 'Cr';
        if (val >= 100000) {
            const lakhs = val / 100000;
            return lakhs % 1 === 0 ? lakhs + 'L' : lakhs.toFixed(1) + 'L';
        }
        if (val >= 1000) return (val / 1000).toFixed(0) + 'k';
        return val;
    };

    const getTimeAgo = (timestamp) => {
        if (!timestamp) return 'Recently';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diff === 0) return 'Today';
        if (diff === 1) return 'Yesterday';
        if (diff < 7) return `${diff}d ago`;
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, borderColor: 'var(--color-primary)' }}
            onClick={onClick}
            className="group relative bg-white border border-gray-100 rounded-[2rem] p-7 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 flex flex-col gap-5 cursor-pointer"
        >
            {/* Top Row: Company & Salary */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-primary border border-gray-100 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <Building2 size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                            {job.company?.name || 'Stealth Startup'}
                        </h4>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/50 w-fit">
                            <Wallet size={10} />
                            ₹{formatSalary(job.salary_min)} — {formatSalary(job.salary_max)}
                        </div>
                    </div>
                </div>
                <div className="p-2 rounded-full bg-gray-50 text-gray-300 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-12">
                    <ArrowUpRight size={18} />
                </div>
            </div>

            {/* Title & Type */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                        {job.job_type?.replace('_', ' ') || 'Full Time'}
                    </span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                        <MapPin size={10} />
                        {job.location || 'Remote'}
                    </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors leading-tight line-clamp-1">
                    {job.title}
                </h3>
            </div>

            {/* Description - Simplified */}
            <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-2">
                {job.description}
            </p>

            {/* Footer Row: Tags & Time */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <div className="flex gap-2">
                    {job.tags?.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="text-[9px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                            #{tag}
                        </span>
                    ))}
                    {job.tags?.length > 2 && (
                        <span className="text-[9px] font-bold text-gray-300 pt-1">
                            +{job.tags.length - 2}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                    <Clock size={10} />
                    {getTimeAgo(job.created_at)}
                </div>
            </div>
        </motion.div>
    );
};

export default JobCard;


