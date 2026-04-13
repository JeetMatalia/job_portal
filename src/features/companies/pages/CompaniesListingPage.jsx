import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, Globe, ExternalLink, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCompanies } from '../../../services/api';
import toast from 'react-hot-toast';

const CompaniesListingPage = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await getCompanies();
            setCompanies(response.data.data || []);
        } catch (error) {
            console.error('Error fetching companies:', error);
            toast.error('Failed to load companies');
        } finally {
            setLoading(false);
        }
    };

    const filteredCompanies = companies.filter(company => 
        (company.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.location?.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-gray-500 font-medium animate-pulse">Loading top companies...</p>
            </div>
        );
    }

    const handleViewProfile = (companyId) => {
        navigate(`/jobs?company_id=${companyId}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <header className="mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wide uppercase"
                >
                    Corporate Directory
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
                >
                    Discover <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Top Companies</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-gray-500 max-w-2xl mx-auto"
                >
                    Connect with industry leaders, innovative startups, and find your perfect workplace environment.
                </motion.p>
            </header>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-12 relative max-w-2xl mx-auto"
            >
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="text-gray-400 w-5 h-5" />
                </div>
                <input
                    type="text"
                    placeholder="Search companies by name or location..."
                    className="w-full pl-12 pr-6 py-5 rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-100/50 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none text-lg text-gray-700 placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </motion.div>

            {filteredCompanies.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-sm"
                >
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Building className="w-10 h-10 text-gray-300" />
                    </div>
                    <p className="text-2xl text-gray-900 font-bold mb-2">No companies found</p>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">We couldn't find any companies matching your search. Try different keywords or browse all.</p>
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                    >
                        Clear Search
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCompanies.map((company, index) => (
                        <motion.div
                            key={company.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (index % 6) * 0.1 }}
                            whileHover={{ y: -8 }}
                            className="group bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 relative overflow-hidden flex flex-col h-full"
                        >
                            {/* Visual background element */}
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                            
                            <div className="flex items-start justify-between mb-8 relative z-10">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                    <Building className="w-10 h-10" />
                                </div>
                                <div className="flex space-x-2">
                                    <a 
                                        href={company.website?.startsWith('http') ? company.website : `https://${company.website}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-3 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                        title="Visit Website"
                                    >
                                        <Globe className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>

                            <div className="relative z-10 flex-grow">
                                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight">
                                    {company.name}
                                </h3>
                                
                                <p className="text-gray-500 mb-8 line-clamp-3 leading-relaxed text-base italic">
                                    "{company.description || "Leading industry solutions and innovation-driven workplace environment, committed to excellence and professional growth."}"
                                </p>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-100 relative z-10">
                                <div className="flex items-center text-gray-600 bg-gray-50/50 px-4 py-2 rounded-xl border border-gray-100/50">
                                    <MapPin className="w-4 h-4 mr-3 text-red-500" />
                                    <span className="text-sm font-bold tracking-tight uppercase">{company.location || 'Remote'}</span>
                                </div>
                                <div className="flex items-center text-gray-600 bg-gray-50/50 px-4 py-2 rounded-xl border border-gray-100/50 truncate">
                                    <ExternalLink className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                                    <span className="text-sm font-medium truncate">{company.website?.replace(/^https?:\/\//, '') || 'N/A'}</span>
                                </div>
                            </div>
                            
                            <div className="mt-8 relative z-10 pt-2">
                                <button 
                                    onClick={() => handleViewProfile(company.id)}
                                    className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold group-hover:bg-primary group-hover:shadow-lg group-hover:shadow-primary/30 transition-all transform active:scale-[0.98] flex items-center justify-center space-x-2"
                                >
                                    <span>View Profile</span>
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompaniesListingPage;
