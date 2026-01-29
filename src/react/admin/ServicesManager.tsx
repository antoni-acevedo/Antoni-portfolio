import React, { useEffect, useState } from "react";
import type { ServiceData } from "../Services";
import { Button, Input, TextArea, Card, Modal } from "./UI";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function ServicesManager() {
  const [items, setItems] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ServiceData>>({});

  const fetchItems = () => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((d) => {
        setItems(d);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item: ServiceData) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingItem({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    toast.promise(fetch(`/api/services/${id}`, { method: "DELETE" }), {
      loading: "Eliminando...",
      success: () => {
        setTimeout(() => window.location.reload(), 1000);
        return "Servicio eliminado correctamente";
      },
      error: "Error al eliminar",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingItem.id;
    const url = isNew ? "/api/services" : `/api/services/${editingItem.id}`;
    const method = isNew ? "POST" : "PUT";

    toast.promise(
      fetch(url, {
        method,
        body: JSON.stringify(editingItem),
        headers: { "Content-Type": "application/json" },
      }),
      {
        loading: "Guardando...",
        success: () => {
          setIsModalOpen(false);
          setTimeout(() => window.location.reload(), 1000);
          return "Servicio guardado correctamente";
        },
        error: "Error al guardar",
      },
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Servicios</h2>
        <Button onClick={handleCreate}>+ Nuevo Servicio</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {items.map((item) => (
            <Card key={item.id} className="flex flex-col gap-4 relative group">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={`${import.meta.env.BASE_URL}images/${item.image}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="bg-gray-100 text-xs px-2 py-1 rounded-full uppercase font-bold text-gray-600">
                  {item.tag}
                </span>
                <h3 className="font-bold text-xl mt-2">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  className="flex-1 text-sm"
                  onClick={() => handleEdit(item)}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 text-sm text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(item.id)}
                >
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem.id ? "Editar Servicio" : "Nuevo Servicio"}
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label="Título"
            value={editingItem.title || ""}
            onChange={(e: any) =>
              setEditingItem({ ...editingItem, title: e.target.value })
            }
            required
          />
          <Input
            label="Tag (Categoría)"
            value={editingItem.tag || ""}
            onChange={(e: any) =>
              setEditingItem({ ...editingItem, tag: e.target.value })
            }
            required
          />
          <TextArea
            label="Descripción"
            value={editingItem.description || ""}
            onChange={(e: any) =>
              setEditingItem({ ...editingItem, description: e.target.value })
            }
            required
          />
          <Input
            label="Imagen (filename)"
            value={editingItem.image || ""}
            onChange={(e: any) =>
              setEditingItem({ ...editingItem, image: e.target.value })
            }
            required
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
