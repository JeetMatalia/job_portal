import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Briefcase, FileText, MapPin, DollarSign, Tag, Plus, Loader2, Sparkles, CheckCircle2, Power } from 'lucide-react';

const jobSchema = z.object({
    title: z.string().min(3, 'Title is too short'),
    description: z.string().min(20, 'Description is too short'),
    job_type: z.string().min(1, 'Please select a job type'),
    location: z.string().min(2, 'Location is required'),
    salary_min: z.coerce.number().min(0, 'Salary must be positive'),
    salary_max: z.coerce.number().min(0, 'Salary must be positive'),
    tags: z.array(z.string()).default([]),
    is_active: z.boolean().default(true),
}).refine(data => data.salary_max >= data.salary_min, {
    message: "Maximum salary cannot be less than minimum salary",
    path: ["salary_max"],
});

const PostJobModal = ({ isOpen, onClose, onSubmit, submitting, initialData = null }) => {
    const isEditing = !!initialData;
    const [tagInput, setTagInput] = useState('');

    const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            title: '',
            description: '',
            job_type: '',
            location: '',
            salary_min: '',
            salary_max: '',
            tags: [],
            is_active: true
        }
    });

    const tags = watch('tags') || [];

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    title: initialData.title || '',
                    description: initialData.description || '',
                    job_type: initialData.job_type || '',
                    location: initialData.location || '',
                    salary_min: initialData.salary_min || '',
                    salary_max: initialData.salary_max || '',
                    tags: initialData.tags || [],
                    is_active: initialData.is_active !== undefined ? initialData.is_active : true
                });
            } else {
                reset({
                    title: '',
                    description: '',
                    job_type: '',
                    location: '',
                    salary_min: '',
                    salary_max: '',
                    tags: [],
                    is_active: true
                });
            }
            setTagInput('');
        }
    }, [initialData, isOpen, reset]);

    const handleAddTag = (e) => {
        if (e) e.preventDefault();
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setValue('tags', [...tags, trimmedTag]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setValue('tags', tags.filter(tag => tag !== tagToRemove));
    };

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
                    className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative z-10 border border-gray-100 overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-8 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                                <Briefcase size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {isEditing ? 'Edit Career Opportunity' : 'Post New Career Opportunity'}
                                </h3>
                                <p className="text-gray-500 font-medium">
                                    {isEditing ? 'Refine your job listing details' : 'Reach the best talent in seconds'}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Job Title */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="premium-label">Role Title</label>
                                <div className="relative group">
                                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        {...register('title')}
                                        type="text" 
                                        placeholder="e.g., Senior Frontend Engineer"
                                        className={`input-field pl-12 ${errors.title ? 'border-red-300' : ''}`} 
                                    />
                                </div>
                                {errors.title && <p className="text-red-500 text-xs font-bold ml-2">{errors.title.message}</p>}
                            </div>

                            {/* Job Type */}
                            <div className="space-y-2">
                                <label className="premium-label">Job Type</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <select 
                                        {...register('job_type')}
                                        className={`input-field pl-12 appearance-none ${errors.job_type ? 'border-red-300' : ''}`}
                                    >
                                        <option value="" disabled>Select Type</option>
                                        <option value="full_time">Full Time</option>
                                        <option value="part_time">Part Time</option>
                                        <option value="remote">Remote</option>
                                        <option value="intern">Internship</option>
                                    </select>
                                </div>
                                {errors.job_type && <p className="text-red-500 text-xs font-bold ml-2">{errors.job_type.message}</p>}
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="premium-label">Location</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        {...register('location')}
                                        type="text" 
                                        placeholder="City, Country"
                                        className={`input-field pl-12 ${errors.location ? 'border-red-300' : ''}`} 
                                    />
                                </div>
                                {errors.location && <p className="text-red-500 text-xs font-bold ml-2">{errors.location.message}</p>}
                            </div>

                            {/* Salary Min */}
                            <div className="space-y-2">
                                <label className="premium-label">Min Salary (INR)</label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        {...register('salary_min')}
                                        type="number" 
                                        placeholder="500,000"
                                        className={`input-field pl-12 ${errors.salary_min ? 'border-red-300' : ''}`} 
                                        min="0"
                                        max="99999999"
                                    />
                                </div>
                                {errors.salary_min && <p className="text-red-500 text-xs font-bold ml-2">{errors.salary_min.message}</p>}
                            </div>

                            {/* Salary Max */}
                            <div className="space-y-2">
                                <label className="premium-label">Max Salary (INR)</label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        {...register('salary_max')}
                                        type="number" 
                                        placeholder="1,200,000"
                                        className={`input-field pl-12 ${errors.salary_max ? 'border-red-300' : ''}`} 
                                        min="0"
                                        max="99999999"
                                    />
                                </div>
                                {errors.salary_max && <p className="text-red-500 text-xs font-bold ml-2">{errors.salary_max.message}</p>}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="premium-label">Description</label>
                            <div className="relative group">
                                <FileText className="absolute left-4 top-5 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                <textarea 
                                    {...register('description')}
                                    placeholder="Outline the responsibilities, requirements, and benefits..."
                                    rows="4"
                                    className={`input-field pl-12 py-4 resize-none ${errors.description ? 'border-red-300' : ''}`} 
                                ></textarea>
                            </div>
                            {errors.description && <p className="text-red-500 text-xs font-bold ml-2">{errors.description.message}</p>}
                        </div>

                        {/* Tags */}
                        <div className="space-y-3">
                            <label className="premium-label">Tags / Skills</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {tags.map((tag, index) => (
                                    <span 
                                        key={index} 
                                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold flex items-center gap-1.5"
                                    >
                                        {tag}
                                        <button 
                                            type="button" 
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-red-500 transition-colors"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="relative group flex gap-2">
                                <div className="relative grow">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        type="text" 
                                        placeholder="Add tag (e.g., Python, Remote)"
                                        className="input-field pl-12" 
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                                    />
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => handleAddTag()}
                                    className="bg-white border border-gray-100 p-4 rounded-2xl text-gray-400 hover:text-primary hover:border-primary transition-all shadow-sm shrink-0"
                                >
                                    <Plus size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Active Toggle */}
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                            <div className="flex items-center gap-3">
                                <Controller
                                    name="is_active"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${field.value ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                                <Power size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Listing Visibility</p>
                                                <p className="text-xs text-gray-500">{field.value ? 'Your job is live and accepting applications' : 'Job is hidden and inactive'}</p>
                                            </div>
                                        </>
                                    )}
                                />
                            </div>
                            <Controller
                                name="is_active"
                                control={control}
                                render={({ field }) => (
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={field.value}
                                            onChange={field.onChange}
                                        />
                                        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                                    </label>
                                )}
                            />
                        </div>

                        {/* Submit */}
                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="btn-primary w-full flex items-center justify-center gap-3 py-6 text-xl mt-4 shadow-xl shadow-primary/20"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    {isEditing ? 'Updating Details...' : 'Publishing Position...'}
                                </>
                            ) : (
                                <>
                                    {isEditing ? 'Save Changes' : 'Publish Job Opening'}
                                    {isEditing ? <CheckCircle2 size={22} /> : <Plus size={22} />}
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PostJobModal;
