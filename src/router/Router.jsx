import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import LoginPage from '../views/authentication/LoginPage';
import SignupPage from '../views/authentication/SignupPage';
import ProfilePage from '../views/user/ProfilePage';
import CompanyPage from '../views/company/CompanyPage';
import CompaniesListingPage from '../views/company/CompaniesListingPage';
import RecruiterDashboard from '../views/jobs/RecruiterDashboard';
import JobListing from '../views/jobs/JobListing';
import MyApplicationsPage from '../views/applications/MyApplicationsPage';

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Placeholder components
const HomePage = () => {
    const { user } = useAuth();
    
    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">Find Your Next <span className="text-primary italic underline underline-offset-8">Career Opportunity</span></h1>
            <p className="text-xl text-gray-500 max-w-2xl px-4">Browse thousands of jobs from over 10,000 companies. Your dream career is just a few clicks away.</p>
            <div className="flex space-x-4">
                {user?.role !== 'recruiter' && (
                    <Link to="/jobs" className="btn-primary">Browse Jobs</Link>
                )}
                <Link to="/dashboard" className="px-6 py-3 border border-gray-200 rounded-lg hover:border-primary hover:text-primary transition-all font-semibold">
                    {user?.role === 'recruiter' ? 'Go to Dashboard' : 'Post a Job'}
                </Link>
            </div>
        </div>
    );
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                
                {/* Public Jobs Route */}
                <Route path="jobs" element={<JobListing />} />

                {/* Protected Seeker Routes */}
                <Route path="my-applications" element={
                    <ProtectedRoute allowedRoles={['job_seeker']}>
                        <MyApplicationsPage />
                    </ProtectedRoute>
                } />
                <Route path="companies" element={
                    <ProtectedRoute allowedRoles={['job_seeker']}>
                        <CompaniesListingPage />
                    </ProtectedRoute>
                } />

                {/* Protected Recruiter Routes */}
                <Route path="dashboard" element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                        <RecruiterDashboard />
                    </ProtectedRoute>
                } />
                <Route path="company" element={
                    <ProtectedRoute allowedRoles={['recruiter']}>
                        <CompanyPage />
                    </ProtectedRoute>
                } />

                {/* Protected Common Routes */}
                <Route path="profile" element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                } />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
