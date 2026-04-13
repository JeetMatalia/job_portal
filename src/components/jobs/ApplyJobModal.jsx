import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Send, Loader2, Sparkles, Building2, MapPin, CheckCircle2 } from 'lucide-react';
import { applyToJob } from '../../api';

const applySchema = z.object({
    cover_letter: z.string()
        .min(20, 'Cover letter must be at least 20 characters')
        .max(5000, 'Cover letter is too long'),
});

const ApplyJobModal = ({ isOpen, onClose, job }) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(applySchema),
    });

    const handleFormSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try {
            await applyToJob(job.id, data.cover_letter);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                reset();
            }, 2000);
        } catch (err) {
            console.error('Error applying to job:', err);
            setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!job) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-md"
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-[0_20px_100px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100"
                    >
                        {success ? (
                            <div className="p-20 flex flex-col items-center justify-center text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center"
                                >
                                    <CheckCircle2 size={48} />
                                </motion.div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-gray-900">Application Sent!</h3>
                                    <p className="text-gray-500 font-medium">Your application for {job.title} has been submitted successfully.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="p-8 pb-0 flex justify-between items-start relative">
                                    <div className="flex gap-5">
                                        <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                                            <Building2 size={32} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10">
                                                    Apply for Position
                                                </span>
                                            </div>
                                            <h2 className="text-2xl font-black text-gray-900">{job.title}</h2>
                                            <div className="flex items-center gap-4 mt-1 text-xs font-bold text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <Building2 size={12} />
                                                    {job.company?.name || 'Stealth Startup'}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={12} />
                                                    {job.location || 'Remote'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={onClose}
                                        className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 transition-all hover:text-gray-900"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit(handleFormSubmit)} className="p-8 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <Sparkles size={14} className="text-primary" />
                                                Cover Letter
                                            </label>
                                            <span className="text-[10px] font-bold text-gray-300">Share your story & experience</span>
                                        </div>
                                        <textarea
                                            {...register('cover_letter')}
                                            placeholder="Introduce yourself and explain why you're a great fit for this role..."
                                            className={`w-full min-h-[240px] p-6 bg-gray-50 border ${errors.cover_letter ? 'border-red-300' : 'border-gray-100'} rounded-3xl outline-none focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-medium leading-relaxed resize-none`}
                                        />
                                        {errors.cover_letter && (
                                            <p className="text-xs text-red-500 font-bold mt-1 px-2">{errors.cover_letter.message}</p>
                                        )}
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake">
                                            <CheckCircle2 size={18} className="rotate-180" />
                                            {error}
                                        </div>
                                    )}

                                    <div className="flex gap-4 pt-2">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 py-5 rounded-2xl border border-gray-100 font-extrabold text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-all text-sm uppercase tracking-widest"
                                        >
                                            Discard
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-[2] btn-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            {loading ? (
                                                <Loader2 className="animate-spin" size={20} />
                                            ) : (
                                                <>
                                                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                    <span className="text-sm uppercase tracking-widest font-black">Submit Application</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ApplyJobModal;
