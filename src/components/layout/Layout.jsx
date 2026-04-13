import React, { useState } from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, User, LogOut, LayoutDashboard, Building, PlusCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import avatar from '../../assets/avatar.png';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
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
                        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm relative z-10 border border-gray-100 overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-pink-500" />
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <div className="text-center">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 shadow-inner">
                                <LogOut className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Sign Out</h3>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                Are you sure you want to sign out of your account? You'll need to login again to access your dashboard.
                            </p>
                            
                            <div className="flex flex-col space-y-3">
                                <button 
                                    onClick={onConfirm}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 font-bold text-white shadow-lg shadow-red-200 transition-all active:scale-95 transform"
                                >
                                    Log Out
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Stay Logged In
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const location = useLocation();

    const isAuthPage = ['/login', '/signup'].includes(location.pathname);

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm fixed w-full top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary">
                    <Briefcase className="w-8 h-8" />
                    <span>JobPortal</span>
                </Link>

                {!isAuthPage && (
                    <div className="hidden md:flex items-center space-x-8">
                        {user?.role !== 'recruiter' && (
                            <NavLink to="/jobs" className={({isActive}) => isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary transition-colors'}>Browse Jobs</NavLink>
                        )}
                        {user?.role === 'recruiter' && (
                            <>
                                <NavLink to="/dashboard" className={({isActive}) => isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary transition-colors'}>Dashboard</NavLink>
                                <NavLink to="/company" className={({isActive}) => isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary transition-colors'}>Company</NavLink>
                            </>
                        )}
                        {user?.role === 'job_seeker' && (
                            <>
                                <NavLink to="/my-applications" className={({isActive}) => isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary transition-colors'}>My Applications</NavLink>
                                <NavLink to="/companies" className={({isActive}) => isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary transition-colors'}>Company</NavLink>
                            </>
                        )}
                    </div>
                )}

                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/profile" className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-full transition-colors font-medium">
                                <img src={user.profileImage || avatar} alt="Profile" className="w-8 h-8 rounded-full border border-gray-100" />
                                <span className="hidden sm:inline">{user.name}</span>
                            </Link>
                            <button onClick={() => setIsLogoutModalOpen(true)} className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="text-gray-600 font-medium hover:text-primary transition-colors">Login</Link>
                            <Link to="/signup" className="btn-primary">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
            
            <LogoutModal 
                isOpen={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
                onConfirm={logout} 
            />
        </nav>
    );
};

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col pt-16">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    © 2026 JobPortal. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
