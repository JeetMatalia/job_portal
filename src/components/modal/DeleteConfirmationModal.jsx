import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2, Loader2 } from 'lucide-react';

const DeleteConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Are you sure?", 
    description = "This action is irreversible.",
    confirmText = "Yes, Delete",
    cancelText = "No, Cancel",
    loading 
}) => {
    if (!isOpen && !loading) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
                    >
                        {/* Decorative Background Element */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-50 rounded-full blur-3xl opacity-50"></div>
                        
                        <div className="relative z-10 flex flex-col items-center text-center">
                            {/* Icon Wrapper */}
                            <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 mb-8 transform -rotate-6">
                                <AlertTriangle size={40} />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4 px-4 leading-tight">
                                {title}
                            </h3>
                            
                            <div className="text-gray-500 mb-10 text-lg leading-relaxed">
                                {description}
                            </div>

                            <div className="flex flex-col w-full gap-4">
                                <button
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className="w-full py-5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <>
                                            <Trash2 size={22} />
                                            {confirmText}
                                        </>
                                    )}
                                </button>
                                
                                <button
                                    onClick={onClose}
                                    disabled={loading}
                                    className="w-full py-5 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold rounded-2xl transition-all flex items-center justify-center active:scale-95 disabled:opacity-50"
                                >
                                    {cancelText}
                                </button>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button 
                            onClick={onClose}
                            disabled={loading}
                            className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 text-gray-300 hover:text-gray-900 transition-all disabled:opacity-0"
                        >
                            <X size={20} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteConfirmationModal;
