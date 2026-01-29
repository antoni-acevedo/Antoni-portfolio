import React, { useState, useEffect } from 'react';
import ProfileEditor from './ProfileEditor';
import ServicesManager from './ServicesManager';
import ProjectsManager from './ProjectsManager';
import JobsManager from './JobsManager';
import { motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { User, Briefcase, Zap, Building2 } from 'lucide-react';

const tabs = [
    { id: 'profile', label: 'Incio / Perfil', icon: User },
    { id: 'projects', label: 'Proyectos', icon: Briefcase },
    { id: 'services', label: 'Servicios', icon: Zap },
    { id: 'jobs', label: 'Experiencia', icon: Building2 },
];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('tab') || 'profile';
        }
        return 'profile';
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        params.set('tab', activeTab);
        window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
    }, [activeTab]);

    return (
        <div className="flex min-h-screen bg-[#f3f3f3]">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 hidden md:block p-6">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-8 bg-black rounded-lg"></div>
                    <h1 className="font-bold text-xl tracking-tight">Admin Panel</h1>
                </div>

                <nav className="flex flex-col gap-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-[#1A1A1A] text-white shadow-lg shadow-black/10' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-6 left-6 text-xs text-gray-400">
                    v1.0.0 • SQLite
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <header className="flex justify-between items-center mb-8 md:hidden">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black rounded-lg"></div>
                        <h1 className="font-bold text-xl tracking-tight">Admin</h1>
                    </div>
                    {/* Mobile Select */}
                    <select
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                        className="bg-white border p-2 rounded-lg"
                    >
                        {tabs.map(tab => (
                            <option key={tab.id} value={tab.id}>{tab.label}</option>
                        ))}
                    </select>
                </header>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'profile' && <ProfileEditor />}
                    {activeTab === 'projects' && <ProjectsManager />}
                    {activeTab === 'services' && <ServicesManager />}
                    {activeTab === 'jobs' && <JobsManager />}
                </motion.div>
                <Toaster position="bottom-right" richColors closeButton />
            </main>
        </div>
    );
}
