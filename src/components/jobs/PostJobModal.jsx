import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, FileText, MapPin, DollarSign, Tag, Plus, Loader2, Sparkles, CheckCircle2, Power } from 'lucide-react';

const PostJobModal = ({ isOpen, onClose, onSubmit, submitting, initialData = null }) => {
    const isEditing = !!initialData;
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        job_type: '',
        location: '',
        salary_min: '',
        salary_max: '',
        tags: [],
        is_active: true
    });
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (initialData && isOpen) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                job_type: initialData.job_type || 'full_time',
                location: initialData.location || '',
                salary_min: initialData.salary_min || '',
                salary_max: initialData.salary_max || '',
                tags: initialData.tags || [],
                is_active: initialData.is_active !== undefined ? initialData.is_active : true
            });
        } else if (!initialData && isOpen) {
            setFormData({
                title: '',
                description: '',
                job_type: '',
                location: '',
                salary_min: '',
                salary_max: '',
                tags: [],
                is_active: true
            });
            setTagInput('');
        }
    }, [initialData, isOpen]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleAddTag = (e) => {
        if (e) e.preventDefault();
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !formData.tags.includes(trimmedTag)) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, trimmedTag]
            }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const salaryMin = parseInt(formData.salary_min) || 0;
        const salaryMax = parseInt(formData.salary_max) || 0;

        if (salaryMax < salaryMin) {
            alert('Maximum salary cannot be less than minimum salary.');
            return;
        }

        const submissionData = {
            ...formData,
            salary_min: salaryMin,
            salary_max: salaryMax
        };
        onSubmit(submissionData);
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
                    <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Job Title */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="premium-label">Role Title</label>
                                <div className="relative group">
                                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        type="text" 
                                        name="title"
                                        placeholder="e.g., Senior Frontend Engineer"
                                        required
                                        className="input-field pl-12" 
                                        value={formData.title}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Job Type */}
                            <div className="space-y-2">
                                <label className="premium-label">Job Type</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <select 
                                        name="job_type"
                                        className="input-field pl-12 appearance-none"
                                        value={formData.job_type}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="" disabled>Select Type</option>
                                        <option value="full_time">Full Time</option>
                                        <option value="part_time">Part Time</option>
                                        <option value="remote">Remote</option>
                                        <option value="intern">Internship</option>
                                    </select>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="premium-label">Location</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        type="text" 
                                        name="location"
                                        placeholder="City, Country"
                                        required
                                        className="input-field pl-12" 
                                        value={formData.location}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Salary Min */}
                            <div className="space-y-2">
                                <label className="premium-label">Min Salary (INR)</label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        type="number" 
                                        name="salary_min"
                                        placeholder="500,000"
                                        required
                                        className="input-field pl-12" 
                                        value={formData.salary_min}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="99999999"
                                    />
                                </div>
                            </div>

                            {/* Salary Max */}
                            <div className="space-y-2">
                                <label className="premium-label">Max Salary (INR)</label>
                                <div className="relative group">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                    <input 
                                        type="number" 
                                        name="salary_max"
                                        placeholder="1,200,000"
                                        required
                                        className="input-field pl-12" 
                                        value={formData.salary_max}
                                        onChange={handleInputChange}
                                        min="0"
                                        max="99999999"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="premium-label">Description</label>
                            <div className="relative group">
                                <FileText className="absolute left-4 top-5 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                                <textarea 
                                    name="description"
                                    placeholder="Outline the responsibilities, requirements, and benefits..."
                                    required
                                    rows="4"
                                    className="input-field pl-12 py-4 resize-none" 
                                    value={formData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-3">
                            <label className="premium-label">Tags / Skills</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.tags.map((tag, index) => (
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
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <Power size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">Listing Visibility</p>
                                    <p className="text-xs text-gray-500">{formData.is_active ? 'Your job is live and accepting applications' : 'Job is hidden and inactive'}</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="is_active"
                                    className="sr-only peer" 
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                />
                                <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                            </label>
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
