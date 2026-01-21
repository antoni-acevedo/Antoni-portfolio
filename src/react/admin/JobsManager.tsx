import React, { useEffect, useState } from 'react';
import type { JobData } from '../LatestJob';
import { Button, Input, TextArea, Card, Modal } from './UI';
import { motion, AnimatePresence } from 'framer-motion';

export default function JobsManager() {
    const [items, setItems] = useState<JobData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<JobData>>({});

    const fetchItems = () => {
        fetch('/api/jobs')
            .then(res => res.json())
            .then(d => {
                setItems(d);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleEdit = (item: JobData) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingItem({});
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this job?')) return;
        await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
        fetchItems();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const isNew = !editingItem.id;
        const url = isNew ? '/api/jobs' : `/api/jobs/${editingItem.id}`;
        const method = isNew ? 'POST' : 'PUT';

        await fetch(url, {
            method,
            body: JSON.stringify(editingItem),
            headers: { 'Content-Type': 'application/json' }
        });

        setIsModalOpen(false);
        fetchItems();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Experiencia (Trabajos)</h2>
                <Button onClick={handleCreate}>+ Nuevo Trabajo</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {items.map(item => (
                        <Card key={item.id} className="flex flex-col gap-4 relative group">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <img src={`/images/${item.image}`} alt={item.company} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="bg-[#1A1A1A] text-white text-xs px-2 py-1 rounded-full uppercase font-bold">{item.tag}</span>
                                    <span className="text-xs text-gray-500">{item.date}</span>
                                </div>
                                <h3 className="font-bold text-xl">{item.company}</h3>
                                <p className="font-medium text-sm text-gray-700 mb-1">{item.role}</p>
                                <p className="text-gray-500 text-sm mt-1 line-clamp-3">{item.description}</p>
                            </div>

                            <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                                <Button variant="ghost" className="flex-1 text-sm" onClick={() => handleEdit(item)}>Editar</Button>
                                <Button variant="ghost" className="flex-1 text-sm text-red-500 hover:text-red-700" onClick={() => handleDelete(item.id)}>Eliminar</Button>
                            </div>
                        </Card>
                    ))}
                </AnimatePresence>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem.id ? 'Editar Trabajo' : 'Nuevo Trabajo'}
            >
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                    <Input
                        label="Empresa"
                        value={editingItem.company || ''}
                        onChange={(e: any) => setEditingItem({ ...editingItem, company: e.target.value })}
                        required
                    />
                    <Input
                        label="Rol"
                        value={editingItem.role || ''}
                        onChange={(e: any) => setEditingItem({ ...editingItem, role: e.target.value })}
                        required
                    />
                    <Input
                        label="Fecha"
                        value={editingItem.date || ''}
                        onChange={(e: any) => setEditingItem({ ...editingItem, date: e.target.value })}
                        required
                    />
                    <Input
                        label="Tag"
                        value={editingItem.tag || ''}
                        onChange={(e: any) => setEditingItem({ ...editingItem, tag: e.target.value })}
                        required
                    />
                    <TextArea
                        label="Descripción"
                        value={editingItem.description || ''}
                        onChange={(e: any) => setEditingItem({ ...editingItem, description: e.target.value })}
                        required
                    />
                    <Input
                        label="Imagen (filename)"
                        value={editingItem.image || ''}
                        onChange={(e: any) => setEditingItem({ ...editingItem, image: e.target.value })}
                        required
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
