import React, { useEffect, useState } from 'react';
import type { ProjectData } from '../MyProjects';
import { Button, Input, TextArea, Card, Modal } from './UI';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function ProjectsManager() {
    const [items, setItems] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<ProjectData> & { tagsString?: string, imagesString?: string }>({});

    const fetchItems = () => {
        fetch('/api/projects')
            .then(res => res.json())
            .then(d => {
                setItems(d);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleEdit = (item: ProjectData) => {
        setEditingItem({
            ...item,
            tagsString: item.tags.join(', '),
            imagesString: item.images.join(', ')
        });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingItem({
            tagsString: '',
            imagesString: ''
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        toast.promise(
            fetch(`/api/projects/${id}`, { method: 'DELETE' }),
            {
                loading: 'Eliminando...',
                success: () => {
                    setTimeout(() => window.location.reload(), 1000);
                    return 'Proyecto eliminado correctamente';
                },
                error: 'Error al eliminar'
            }
        );
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const isNew = !editingItem.id;
        const url = isNew ? '/api/projects' : `/api/projects/${editingItem.id}`;
        const method = isNew ? 'POST' : 'PUT';

        // Convert strings back to arrays
        const payload = {
            ...editingItem,
            tags: editingItem.tagsString?.split(',').map(s => s.trim()).filter(Boolean) || [],
            images: editingItem.imagesString?.split(',').map(s => s.trim()).filter(Boolean) || [],
        };
        // remove temp fields
        delete (payload as any).tagsString;
        delete (payload as any).imagesString;

        toast.promise(
            fetch(url, {
                method,
                body: JSON.stringify(payload),
                headers: { 'Content-Type': 'application/json' }
            }),
            {
                loading: 'Guardando...',
                success: () => {
                    setIsModalOpen(false);
                    setTimeout(() => window.location.reload(), 1000);
                    return 'Proyecto guardado correctamente';
                },
                error: 'Error al guardar'
            }
        );
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Proyectos</h2>
                <Button onClick={handleCreate}>+ Nuevo Proyecto</Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                    {items.map(item => (
                        <Card key={item.id} className="flex flex-col md:flex-row gap-6 relative group">
                            <div className="w-full md:w-48 aspect-video bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                <img src={`/images/${item.images[0]}`} alt={item.company} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-xl">{item.company}</h3>
                                        <p className="text-sm font-medium text-gray-500">{item.role} • {item.date}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {item.tags.map(t => (
                                            <span key={t} className="bg-gray-100 text-xs px-2 py-1 rounded-full">{t}</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 mt-2">{item.desc}</p>
                                <div className="flex gap-2 mt-4">
                                    <Button variant="ghost" className="text-sm border border-gray-200" onClick={() => handleEdit(item)}>Editar</Button>
                                    <Button variant="ghost" className="text-sm text-red-500 hover:text-red-700" onClick={() => handleDelete(item.id)}>Eliminar</Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </AnimatePresence>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem.id ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            >
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Empresa/Título"
                        value={editingItem.company || ''}
                        onChange={(e: any) => setEditingItem({ ...editingItem, company: e.target.value })}
                        required
                        className="md:col-span-2"
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
                        label="Tags (separados por coma)"
                        value={editingItem.tagsString || ''}
                        onChange={(e: any) => setEditingItem({ ...editingItem, tagsString: e.target.value })}
                        placeholder="React, Node.js, AWS"
                        className="md:col-span-2"
                    />
                    <Input
                        label="Imágenes (nombres de archivo separados por coma)"
                        value={editingItem.imagesString || ''}
                        onChange={(e: any) => setEditingItem({ ...editingItem, imagesString: e.target.value })}
                        placeholder="img1.png, img2.png"
                        className="md:col-span-2"
                    />
                    <TextArea
                        label="Descripción Corta"
                        value={editingItem.desc || ''}
                        onChange={(e: any) => setEditingItem({ ...editingItem, desc: e.target.value })}
                        rows={2}
                        className="md:col-span-2"
                    />
                    <TextArea
                        label="Descripción Larga"
                        value={editingItem.long_desc || ''}
                        onChange={(e: any) => setEditingItem({ ...editingItem, long_desc: e.target.value })}
                        rows={4}
                        className="md:col-span-2"
                    />

                    <div className="flex justify-end gap-2 mt-4 md:col-span-2">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Guardar</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
