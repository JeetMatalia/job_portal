import React, { useState, useEffect } from 'react';
import { getOwnCompany, createCompany, updateCompany, deleteCompany } from '../../api';
import { Building2, Globe, MapPin, FileText, CheckCircle2, AlertCircle, Loader2, ArrowLeft, Trash2, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import RegisterCompanyForm from '../../components/company/RegisterCompanyForm';
import DeleteConfirmationModal from '../../components/modal/DeleteConfirmationModal';

const companySchema = z.object({
    name: z.string().min(2, 'Company name must be at least 2 characters'),
    website: z.string().url('Invalid website URL').or(z.string().min(1, 'Website is required')),
    location: z.string().min(2, 'Location must be at least 2 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
});

const SuccessCelebration = ({ companyName, onContinue }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center p-12 glass-card max-w-2xl mx-auto"
        >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-8 shadow-inner">
                <CheckCircle2 size={48} className="animate-bounce" />
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                Welcome Aboard, <span className="text-primary">{companyName}!</span>
            </h2>
            <p className="text-gray-500 text-lg mb-10 max-w-md">
                Your company profile is all set. You can now start posting job openings and finding the best talent globally.
            </p>
            <button 
                onClick={onContinue}
                className="btn-primary flex items-center gap-2 group px-10 py-5 text-lg"
            >
                Go to Dashboard
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </motion.div>
    );
};

const CompanyPage = () => {
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(companySchema),
    });

    useEffect(() => {
        fetchCompany();
    }, []);

    const fetchCompany = async () => {
        try {
            setLoading(true);
            const response = await getOwnCompany();
            if (response.data && response.data.data) {
                setCompany(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching company:', err);
            if (err.response?.status !== 404) {
                setError('Failed to load company details.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        reset({
            name: company.name,
            description: company.description,
            website: company.website,
            location: company.location
        });
        setIsEditing(true);
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteCompany(company.id);
            setCompany(null);
            setShowDeleteModal(false);
            setIsCreating(false);
            setShowSuccess(false);
        } catch (err) {
            console.error('Error deleting company:', err);
            setError(err.response?.data?.message || 'Failed to delete company. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleFormSubmit = async (data) => {
        setSubmitting(true);
        setError(null);
        try {
            const response = await createCompany(data);
            if (response.data && response.data.data) {
                setCompany(response.data.data);
                setShowSuccess(true);
                setIsCreating(false);
            }
        } catch (err) {
            console.error('Error creating company:', err);
            setError(err.response?.data?.message || 'Failed to create company. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (data) => {
        setSubmitting(true);
        setError(null);
        try {
            const response = await updateCompany(company.id, data);
            if (response.data && response.data.data) {
                setCompany(response.data.data);
                setIsEditing(false);
            }
        } catch (err) {
            console.error('Error updating company:', err);
            setError(err.response?.data?.message || 'Failed to update company. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="animate-spin text-primary" size={64} />
                <p className="text-gray-400 font-medium animate-pulse text-lg">Initializing your organization dashboard...</p>
            </div>
        );
    }

    if (showSuccess) {
        return (
            <div className="container mx-auto px-4 py-20">
                <SuccessCelebration 
                    companyName={company.name} 
                    onContinue={() => setShowSuccess(false)} 
                />
            </div>
        );
    }

    if (!company && !isCreating) {
        return (
            <div className="container mx-auto px-4 py-12 lg:py-24 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest border border-primary/20">
                            <Sparkles size={16} />
                            <span>Recruiter Exclusive</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                            Ready to hire the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Best Talent?</span>
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed max-w-xl font-medium">
                            Unlock the full potential of our job portal. Register your organization and start building your high-performing team today.
                        </p>
                        
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button 
                                onClick={() => setIsCreating(true)}
                                className="btn-primary px-10 py-5 text-xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all"
                            >
                                Get Started Now
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-10 py-5 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all text-xl shadow-sm border-b-4 hover:border-b-2 active:border-b-0 active:translate-y-1">
                                View Demo
                            </button>
                        </div>

                        <div className="flex items-center gap-8 pt-8">
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-gray-200 shadow-sm overflow-hidden ring-2 ring-gray-50">
                                        <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="Recruiter" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-gray-500 font-bold text-lg">
                                Join <span className="text-primary">500+</span> top companies hiring here.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary to-purple-600 rounded-[4rem] blur-2xl opacity-10"></div>
                        <div className="relative glass-card p-2 rounded-[3.5rem] bg-white/50 border-white">
                            <div className="bg-white rounded-[3rem] p-5 shadow-inner overflow-hidden aspect-[4/3] group relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" 
                                    alt="Modern Office" 
                                    className="rounded-[2.5rem] w-full h-full object-cover shadow-2xl group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 shadow-2xl pointer-events-none group-hover:scale-110 transition-transform">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl">
                                        <Building2 size={36} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <motion.div 
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            className="absolute -top-12 -right-12 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-gray-50 z-10 hidden md:block"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center text-blue-600 ring-4 ring-blue-50/50">
                                    <Sparkles size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em] mb-1">Growth Index</p>
                                    <p className="text-2xl font-black text-gray-900 tracking-tight">+124% Hiring</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        );
    }

    if (isCreating) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <button 
                    onClick={() => setIsCreating(false)}
                    className="group flex items-center gap-3 text-gray-500 font-bold hover:text-primary mb-12 transition-all p-4 -ml-4 rounded-2xl hover:bg-white hover:shadow-sm"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Overview
                </button>
                <RegisterCompanyForm 
                    onSubmit={handleFormSubmit}
                    submitting={submitting}
                    error={error}
                />
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="mb-12">
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="group flex items-center gap-3 text-gray-500 font-bold hover:text-primary mb-6 transition-all p-4 -ml-4 rounded-2xl hover:bg-white hover:shadow-sm"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Cancel Changes
                    </button>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight">Edit Organization</h1>
                    <p className="text-gray-500 text-xl mt-3 font-medium">Update your digital identity and corporate details.</p>
                </div>

                <div className="glass-card p-1 rounded-[3rem]">
                    <div className="bg-white p-12 rounded-[2.8rem] shadow-inner">
                        <form onSubmit={handleSubmit(handleUpdate)} className="space-y-10">
                            {(error || Object.keys(errors).length > 0) && (
                                <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-[2rem] text-sm flex flex-col gap-2 animate-shake">
                                    {error && (
                                        <div className="flex items-center gap-4">
                                            <AlertCircle className="shrink-0" size={28} />
                                            <p className="font-bold">{error}</p>
                                        </div>
                                    )}
                                    {Object.values(errors).map((err, i) => (
                                        <p key={i} className="text-xs font-semibold ml-11">• {err.message}</p>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Display Name</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-all duration-300" size={24} />
                                        <input 
                                            {...register('name')}
                                            type="text" 
                                            className={`input-field pl-16 h-16 text-lg font-semibold focus:ring-4 focus:ring-primary/5 ${errors.name ? 'border-red-300' : ''}`} 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Web Address</label>
                                    <div className="relative group">
                                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-all duration-300" size={24} />
                                        <input 
                                            {...register('website')}
                                            type="text" 
                                            className={`input-field pl-16 h-16 text-lg font-semibold focus:ring-4 focus:ring-primary/5 ${errors.website ? 'border-red-300' : ''}`} 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">Headquarters</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-all duration-300" size={24} />
                                        <input 
                                            {...register('location')}
                                            type="text" 
                                            className={`input-field pl-16 h-16 text-lg font-semibold focus:ring-4 focus:ring-primary/5 ${errors.location ? 'border-red-300' : ''}`} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">About Section</label>
                                <div className="relative group">
                                    <FileText className="absolute left-5 top-6 text-gray-300 group-focus-within:text-primary transition-all duration-300" size={24} />
                                    <textarea 
                                        {...register('description')}
                                        rows="6"
                                        className={`input-field pl-16 py-6 resize-none text-lg font-medium leading-relaxed focus:ring-4 focus:ring-primary/5 ${errors.description ? 'border-red-300' : ''}`} 
                                    ></textarea>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="btn-primary w-full flex items-center justify-center gap-4 py-6 text-xl tracking-wide font-black shadow-2xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={28} />
                                            Synchronizing...
                                        </>
                                    ) : (
                                        <>
                                            Publish All Changes
                                            <CheckCircle2 size={28} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Dashboard-Style Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div className="md:col-span-2 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">Organization Dashboard</span>
                        <span className="flex items-center bg-green-400/10 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest gap-2 border border-green-500/10">
                            <CheckCircle2 size={14} />
                            Verified Partner
                        </span>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="w-24 h-24 lg:w-28 lg:h-28 bg-white border border-gray-100 rounded-[2.5rem] flex items-center justify-center text-primary shadow-2xl shadow-primary/5 transform -rotate-3 hover:rotate-0 transition-all duration-500 shrink-0">
                            <span className="text-4xl lg:text-5xl font-black uppercase tracking-tighter">
                                {company.name?.[0]}
                            </span>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tight leading-none">
                                {company.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-gray-400 font-bold text-lg">
                                <span className="flex items-center gap-2">
                                    <MapPin size={20} className="text-primary/40" />
                                    {company.location}
                                </span>
                                <span className="flex items-center gap-2">
                                    <Globe size={20} className="text-primary/40" />
                                    {company.website.replace('https://', '').replace('http://', '')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-bold group-hover:scale-110 transition-transform shadow-inner">
                        <TrendingUp size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Growth Status</p>
                        <p className="text-2xl font-black text-gray-900">Est. {new Date(company.created_at).getFullYear()}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 font-bold group-hover:scale-110 transition-transform shadow-inner">
                        <Sparkles size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">System Health</p>
                        <p className="text-2xl font-black text-gray-900">100% Synched</p>
                    </div>
                </div>
            </div>

            {/* Actions Row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="bg-gray-100 p-1.5 rounded-2xl shadow-inner flex shrink-0">
                        <div className="px-6 py-2.5 bg-white text-primary rounded-xl text-sm font-bold shadow-sm flex items-center gap-2">
                            <Building2 size={18} />
                            Entity Profile
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button 
                        onClick={handleEdit}
                        className="bg-white border border-gray-100 text-gray-600 hover:text-primary hover:border-primary px-8 h-14 rounded-2xl font-black text-sm shadow-sm hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 shrink-0 flex-1 md:flex-none"
                    >
                        <FileText size={20} />
                        Update Profile
                    </button>
                    <a 
                        href={`/dashboard`} 
                        className="btn-primary h-14 px-8 flex items-center gap-3 justify-center text-sm shadow-xl shadow-primary/20 flex-1 md:flex-none"
                    >
                        Go to Dashboard
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content Area (Matches Dashboard Feel) */}
                <div className="lg:col-span-2 space-y-10">
                    <section className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:bg-primary/10 transition-colors duration-500"></div>
                        <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <FileText size={24} />
                            </div>
                            Organization Biography
                        </h3>
                        <p className="text-xl text-gray-600 leading-[1.8] font-medium relative z-10 whitespace-pre-wrap selection:bg-primary/20">
                            {company.description}
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <a 
                            href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative"
                        >
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50 rounded-full translate-x-12 translate-y-12 blur-2xl group-hover:bg-blue-100 transition-colors"></div>
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-inner">
                                    <Globe size={32} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Official Resource</p>
                                    <p className="text-xl font-bold text-gray-900 truncate group-hover:text-primary transition-colors">{company.website.replace('https://', '').replace('http://', '')}</p>
                                </div>
                            </div>
                        </a>

                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm group overflow-hidden relative hover:shadow-2xl transition-all">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-50 rounded-full translate-x-12 translate-y-12 blur-2xl group-hover:bg-amber-100 transition-colors"></div>
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-16 h-16 bg-amber-100/50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-inner">
                                    <MapPin size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Corporate Base</p>
                                    <p className="text-xl font-bold text-gray-900">{company.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Utility & Logs) */}
                <div className="space-y-10">
                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-10 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gray-50 rounded-full -mr-24 -mt-24 blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <TrendingUp size={20} />
                                </div>
                                Infrastructure
                            </h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full mt-2 shadow-lg shadow-green-500/50"></div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 uppercase tracking-wide">Cloud Database</p>
                                        <p className="text-xs text-gray-400 font-bold mt-1">Status: Operational</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-2 shadow-lg shadow-blue-500/50"></div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 uppercase tracking-wide">Recruitment API</p>
                                        <p className="text-xs text-gray-400 font-bold mt-1">Latency: 24ms</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-2 shadow-lg shadow-purple-500/50"></div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 uppercase tracking-wide">Security Mesh</p>
                                        <p className="text-xs text-gray-400 font-bold mt-1">Level: Enterprise</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-50 relative z-10">
                            <button className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-sm hover:bg-black active:scale-95 transition-all shadow-xl shadow-gray-200">
                                System Analytics
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Authority Redaction (Full Width) */}
            <div className="mt-12 bg-red-50/30 rounded-[3rem] p-10 lg:p-14 border border-red-100/50 flex flex-col lg:flex-row lg:items-center justify-between gap-10 group hover:bg-red-50/50 transition-all duration-500 shadow-sm hover:shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center gap-8 text-left">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-xl shadow-red-500/10 shrink-0">
                        <AlertCircle size={32} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-2xl font-black text-gray-900 leading-tight">Authority Redaction</h4>
                        <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">
                            Permanently terminate your organization's presence. This action will purge all associated data, including job listings and applicant history, and cannot be reversed.
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-white border-2 border-red-100 hover:border-red-500 text-red-500 px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-500/5 hover:bg-red-500 hover:text-white hover:shadow-red-500/30 active:scale-95 transition-all duration-300 flex items-center justify-center gap-4 group/btn shrink-0"
                >
                    Execute Deletion
                    <Trash2 size={24} className="group-hover/btn:rotate-12 transition-transform" />
                </button>
            </div>

            <DeleteConfirmationModal 
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Unregister Organization?"
                description={<>You are about to permanently remove <span className="font-bold text-gray-900">"{company.name}"</span>. All recruiting data and active job posts will be destroyed forever.</>}
                confirmText="Permanently Purge Records"
                cancelText="Maintain My Presence"
                loading={isDeleting}
            />
        </div>
    );
};

export default CompanyPage;
