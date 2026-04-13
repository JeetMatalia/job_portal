import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Building2, Globe, MapPin, FileText, Loader2, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const companySchema = z.object({
    name: z.string().min(2, 'Company name must be at least 2 characters'),
    website: z.string().url('Invalid website URL').or(z.string().min(1, 'Website is required')),
    location: z.string().min(2, 'Location must be at least 2 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
});

const RegisterCompanyForm = ({ onSubmit, submitting, error }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(companySchema),
    });

    const [focusedField, setFocusedField] = useState(null);

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { 
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-4xl mx-auto"
        >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
                {/* Left Side: Info & Motivation */}
                <div className="lg:col-span-2 space-y-6 flex flex-col justify-center">
                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                            <Sparkles size={14} />
                            <span>Grow Your Team</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Dream Company</span> Profile
                        </h2>
                        <p className="text-gray-500 text-lg leading-relaxed">
                            A great company profile helps you attract the best talent. Tell your story, show your culture, and start hiring.
                        </p>
                    </motion.div>

                    <motion.ul variants={itemVariants} className="space-y-4">
                        {[
                            'Showcase your company culture',
                            'Post unlimited job openings',
                            'Manage applications with ease',
                            'Get verified recruiter badge'
                        ].map((text, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-600 font-medium">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                    <CheckCircle2 size={14} />
                                </div>
                                <span>{text}</span>
                            </li>
                        ))}
                    </motion.ul>
                </div>

                {/* Right Side: The Form */}
                <motion.div 
                    variants={itemVariants}
                    className="lg:col-span-3 glass-card p-1 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600"></div>
                    <form 
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-8 space-y-6"
                    >
                        {(error || Object.keys(errors).length > 0) && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm flex flex-col gap-2"
                            >
                                {error && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                                            <FileText size={16} />
                                        </div>
                                        {error}
                                    </div>
                                )}
                                {Object.values(errors).map((err, i) => (
                                    <p key={i} className="text-xs font-semibold ml-11">• {err.message}</p>
                                ))}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="group">
                                <label className="premium-label">Company Name</label>
                                <div className={`relative transition-all duration-300 ${focusedField === 'name' ? 'scale-[1.02]' : ''}`}>
                                    <Building2 className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'name' ? 'text-primary' : 'text-gray-400'}`} size={20} />
                                    <input 
                                        {...register('name')}
                                        type="text" 
                                        className={`input-field pl-12 ${errors.name ? 'border-red-300' : ''}`} 
                                        placeholder="e.g. Google India"
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="group">
                                    <label className="premium-label">Website</label>
                                    <div className={`relative transition-all duration-300 ${focusedField === 'website' ? 'scale-[1.02]' : ''}`}>
                                        <Globe className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'website' ? 'text-primary' : 'text-gray-400'}`} size={20} />
                                        <input 
                                            {...register('website')}
                                            type="text" 
                                            className={`input-field pl-12 ${errors.website ? 'border-red-300' : ''}`} 
                                            placeholder="https://acme.com"
                                            onFocus={() => setFocusedField('website')}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="premium-label">Location</label>
                                    <div className={`relative transition-all duration-300 ${focusedField === 'location' ? 'scale-[1.02]' : ''}`}>
                                        <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'location' ? 'text-primary' : 'text-gray-400'}`} size={20} />
                                        <input 
                                            {...register('location')}
                                            type="text" 
                                            className={`input-field pl-12 ${errors.location ? 'border-red-300' : ''}`} 
                                            placeholder="Mumbai, India"
                                            onFocus={() => setFocusedField('location')}
                                            onBlur={() => setFocusedField(null)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <label className="premium-label">About the Company</label>
                                <div className={`relative transition-all duration-300 ${focusedField === 'description' ? 'scale-[1.01]' : ''}`}>
                                    <FileText className={`absolute left-4 top-4 transition-colors ${focusedField === 'description' ? 'text-primary' : 'text-gray-400'}`} size={20} />
                                    <textarea 
                                        {...register('description')}
                                        rows="4"
                                        className={`input-field pl-12 py-4 resize-none min-h-[120px] ${errors.description ? 'border-red-300' : ''}`} 
                                        placeholder="Describe your company's mission, culture, and achievements..."
                                        onFocus={() => setFocusedField('description')}
                                        onBlur={() => setFocusedField(null)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={submitting}
                            className="btn-primary w-full flex items-center justify-center gap-3 py-5 text-lg group"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Complete Profile
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default RegisterCompanyForm;
