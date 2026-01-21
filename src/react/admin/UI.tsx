import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, onClick, variant = 'primary', className = '', ...props }: any) => {
    const base = "px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-[#1A1A1A] text-white hover:bg-black",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        danger: "bg-red-500 text-white hover:bg-red-600",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100"
    };
    return (
        <button onClick={onClick} className={`${base} ${(variants as any)[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export const Input = ({ label, ...props }: any) => (
    <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-medium text-gray-600">{label}</label>}
        <input className="px-4 py-2 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white" {...props} />
    </div>
);

export const TextArea = ({ label, rows = 3, ...props }: any) => (
    <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-medium text-gray-600">{label}</label>}
        <textarea rows={rows} className="px-4 py-2 rounded-lg border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white resize-y" {...props} />
    </div>
);

export const Card = ({ children, className = '' }: any) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 ${className}`}
    >
        {children}
    </motion.div>
);

export const Modal = ({ isOpen, onClose, title, children }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};
