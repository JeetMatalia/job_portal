import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import { UserPlus, User, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const signupSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['job_seeker', 'recruiter'], { required_error: 'Please select a role' }),
});

const SignupPage = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            role: 'job_seeker'
        }
    });

    const selectedRole = watch('role');

    const onSubmit = async (data) => {
        setIsLoading(true);
        const result = await signup(data);

        if (result.success) {
            toast.success('Account created successfully! Please login.');
            navigate('/login');
        } else {
            toast.error(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center">
                <div className="p-3 bg-primary-bg rounded-full mb-6 text-primary">
                    <UserPlus className="w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-500 mb-8">Join our community and find your dream job or talent</p>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input {...register('first_name')} type="text" placeholder="John" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.first_name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-primary-bg'}`} />
                            {errors.first_name && <p className="text-xs text-red-500 mt-1">{errors.first_name.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input {...register('last_name')} type="text" placeholder="Doe" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.last_name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-primary-bg'}`} />
                            {errors.last_name && <p className="text-xs text-red-500 mt-1">{errors.last_name.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input {...register('email')} type="email" placeholder="example@domain.com" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-primary-bg'}`} />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input {...register('password')} type="password" placeholder="••••••••" className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-primary-bg'}`} />
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${selectedRole === 'job_seeker' ? 'border-primary ring-2 ring-primary/10 bg-primary/5' : 'border-gray-200 hover:border-primary/50 bg-white'} ${errors.role ? 'border-red-500' : ''} text-center group relative`}>
                                <input {...register('role')} type="radio" value="job_seeker" className="absolute opacity-0" />
                                <div className={`p-2 rounded-full mb-2 transition-colors ${selectedRole === 'job_seeker' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400 group-hover:text-primary'}`}>
                                    <User className="w-5 h-5" />
                                </div>
                                <span className={`text-sm font-medium transition-colors ${selectedRole === 'job_seeker' ? 'text-primary' : 'text-gray-700 group-hover:text-primary'}`}>Job Seeker</span>
                            </label>
                            <label className={`flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-all ${selectedRole === 'recruiter' ? 'border-primary ring-2 ring-primary/10 bg-primary/5' : 'border-gray-200 hover:border-primary/50 bg-white'} ${errors.role ? 'border-red-500' : ''} text-center group relative`}>
                                <input {...register('role')} type="radio" value="recruiter" className="absolute opacity-0" />
                                <div className={`p-2 rounded-full mb-2 transition-colors ${selectedRole === 'recruiter' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400 group-hover:text-primary'}`}>
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <span className={`text-sm font-medium transition-colors ${selectedRole === 'recruiter' ? 'text-primary' : 'text-gray-700 group-hover:text-primary'}`}>Recruiter</span>
                            </label>
                        </div>
                        {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-semibold flex items-center justify-center space-x-2 disabled:bg-gray-400">
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <span>Create Account</span>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;
