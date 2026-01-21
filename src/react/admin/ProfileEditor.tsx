import React, { useEffect, useState } from 'react';
import type { ProfileData } from '../About';
import { Button, Input, TextArea, Card } from './UI';
import { motion } from 'framer-motion';

export default function ProfileEditor() {
    const [data, setData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/profile')
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data) return;
        setSaving(true);
        await fetch('/api/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
        setSaving(false);
        alert('Profile updated!');
    };

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>Error loading profile</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Editar Perfil</h2>
                <Button onClick={handleSubmit} disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="flex flex-col gap-4">
                    <h3 className="font-bold text-lg border-b pb-2 mb-2">Información Principal</h3>
                    <Input
                        label="Título Principal"
                        value={data.title}
                        onChange={(e: any) => setData({ ...data, title: e.target.value })}
                    />
                    <TextArea
                        label="Descripción Corta"
                        value={data.description}
                        onChange={(e: any) => setData({ ...data, description: e.target.value })}
                        rows={4}
                    />
                    <Input
                        label="Texto Destacado"
                        value={data.highlight_text}
                        onChange={(e: any) => setData({ ...data, highlight_text: e.target.value })}
                    />
                </Card>

                <Card className="flex flex-col gap-4">
                    <h3 className="font-bold text-lg border-b pb-2 mb-2">Estadísticas & Imágenes</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            type="number"
                            label="Años Experiencia"
                            value={data.years_experience}
                            onChange={(e: any) => setData({ ...data, years_experience: parseInt(e.target.value) })}
                        />
                        <Input
                            label="Texto Experiencia"
                            value={data.experience_text}
                            onChange={(e: any) => setData({ ...data, experience_text: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Imagen Principal (nombre archivo en public/images/)"
                        value={data.profile_image}
                        onChange={(e: any) => setData({ ...data, profile_image: e.target.value })}
                    />
                    <Input
                        label="Imagen Secundaria"
                        value={data.secondary_image}
                        onChange={(e: any) => setData({ ...data, secondary_image: e.target.value })}
                    />
                </Card>

                <Card className="md:col-span-2 flex flex-col gap-4">
                    <h3 className="font-bold text-lg border-b pb-2 mb-2">Puntos Clave</h3>
                    <TextArea
                        label="Bullet Point 1"
                        value={data.bullet_1}
                        onChange={(e: any) => setData({ ...data, bullet_1: e.target.value })}
                    />
                    <TextArea
                        label="Bullet Point 2"
                        value={data.bullet_2}
                        onChange={(e: any) => setData({ ...data, bullet_2: e.target.value })}
                    />
                </Card>
            </form>
        </motion.div>
    );
}
