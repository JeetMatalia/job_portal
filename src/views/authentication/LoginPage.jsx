import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema } from '../../utils/validation';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        const result = await login(data.email, data.password);
        if (result.success) {
            toast.success('Login successful! Welcome back.');
            navigate(from, { replace: true });
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center">
                <div className="p-3 bg-primary-bg rounded-full mb-6">
                    <LogIn className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-500 mb-8">Please enter your credentials to login</p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
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

                    <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all font-semibold flex items-center justify-center space-x-2 disabled:bg-gray-400">
                        {isSubmitting ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-600">
                    Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up for free</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
