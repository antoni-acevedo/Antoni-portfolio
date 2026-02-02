import React, { useEffect, useState } from "react";
import { Button, Input, Card, Modal } from "./UI";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export interface FeaturedProjectData {
  id: number;
  title: string;
  client: string;
  image: string;
  category: string;
  category_en?: string;
}

export default function FeaturedProjectsManager() {
  const [items, setItems] = useState<FeaturedProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<FeaturedProjectData>>(
    {},
  );
  const [lang, setLang] = useState<"es" | "en">("es");

  const fetchItems = () => {
    fetch("/api/featured-projects")
      .then((res) => res.json())
      .then((d) => {
        setItems(d);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item: FeaturedProjectData) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingItem({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this featured project?"))
      return;

    toast.promise(fetch(`/api/featured-projects/${id}`, { method: "DELETE" }), {
      loading: "Eliminando...",
      success: () => {
        setTimeout(() => window.location.reload(), 1000);
        return "Proyecto destacado eliminado correctamente";
      },
      error: "Error al eliminar",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingItem.id;
    const url = isNew
      ? "/api/featured-projects"
      : `/api/featured-projects/${editingItem.id}`;
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
          return "Proyecto destacado guardado correctamente";
        },
        error: "Error al guardar",
      },
    );
  };

  const getCategory = (item: FeaturedProjectData) => {
    if (lang === "es") return item.category;
    return item.category_en || item.category;
  };

  const handleCategoryChange = (val: string) => {
    if (lang === "es") {
      setEditingItem({ ...editingItem, category: val });
    } else {
      setEditingItem({ ...editingItem, category_en: val });
    }
  };

  const currentCategoryValue =
    lang === "es" ? editingItem.category || "" : editingItem.category_en || "";

  const getImageUrl = (name: string) => {
    if (!name) return "";
    if (name.startsWith("http") || name.startsWith("data:")) return name;
    const cleanName = name
      .replace("src/assets/projectImages/", "projectImages/")
      .replace("src/assets/", "")
      .replace(/^\//, "");

    return `${import.meta.env.BASE_URL}images/${cleanName}`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Proyectos Destacados (Carousel)
        </h2>
        <div className="flex gap-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setLang("es")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${lang === "es" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"}`}
            >
              Español
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${lang === "en" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"}`}
            >
              English
            </button>
          </div>
          <Button onClick={handleCreate}>+ Nuevo Destacado</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {items.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col gap-4 relative group overflow-hidden"
            >
              <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-bold text-xl">{item.title}</h3>
                <p className="text-sm text-gray-400 font-medium">
                  For <span className="text-black">{item.client}</span>
                </p>
                <p className="text-xs mt-2 inline-block px-2 py-1 bg-gray-100 rounded-full">
                  {getCategory(item)}
                </p>
              </div>

              <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  className="text-sm border border-gray-200 flex-1"
                  onClick={() => handleEdit(item)}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  className="text-sm text-red-500 hover:text-red-700 flex-1"
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
        title={editingItem.id ? `Editar Destacado` : `Nuevo Destacado`}
      >
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-4">
          <Input
            label="Título (Nombre del Proyecto)"
            value={editingItem.title || ""}
            onChange={(e: any) =>
              setEditingItem({ ...editingItem, title: e.target.value })
            }
            required
          />
          <Input
            label="Cliente"
            value={editingItem.client || ""}
            onChange={(e: any) =>
              setEditingItem({ ...editingItem, client: e.target.value })
            }
            required
          />
          <Input
            label={`Categoría (${lang})`}
            value={currentCategoryValue}
            onChange={(e: any) => handleCategoryChange(e.target.value)}
            required={lang === "es"} // Only required for base language, or make both required?
            placeholder={
              lang === "es" ? "Ej: Plataforma Web" : "Ex: Web Platform"
            }
          />
          <Input
            label="Imagen (Nombre de archivo)"
            value={editingItem.image || ""}
            onChange={(e: any) =>
              setEditingItem({ ...editingItem, image: e.target.value })
            }
            placeholder="mockImg.png"
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
