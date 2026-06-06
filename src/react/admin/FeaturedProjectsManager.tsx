import React, { useEffect, useState } from "react";
import { Button, Input, Card, Modal } from "./UI";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { ProjectData } from "../MyProjects";

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

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectImages, setProjectImages] = useState<string[]>([]);

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

  useEffect(() => {
    if (isModalOpen) {
      fetch("/api/projects")
        .then((res) => res.json())
        .then(setProjects);
    } else {
      setSelectedProjectId(null);
      setProjectImages([]);
    }
  }, [isModalOpen]);

  const handleEdit = (item: FeaturedProjectData) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingItem({});
    setIsModalOpen(true);
  };

  const selectProject = (projectId: string) => {
    if (!projectId) {
      setSelectedProjectId(null);
      setProjectImages([]);
      return;
    }
    const id = Number(projectId);
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    setSelectedProjectId(id);
    setEditingItem((prev) => ({ ...prev, title: project.company }));

    // Extract folder name from first image path
    const folderMatch = project.images[0]?.match(/projectImages\/([^/]+)/);
    const folder = folderMatch ? folderMatch[1] : project.company;
    const images = project.images.map((img) => {
      const parts = img.split("/");
      return { filename: parts[parts.length - 1], folder };
    });
    setProjectImages(images);
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

  const cleanImageForSave = (path: string) => {
    if (!path) return "";
    let clean = path;
    // Remove known prefixes that shouldn't be in the DB
    clean = clean.replace("/Portfolio/", ""); // Remove explicit base url if present
    clean = clean.replace("src/assets/projectImages/", "projectImages/");
    clean = clean.replace("src/assets/", "");
    clean = clean.replace(/^\/+/, ""); // Remove leading slashes
    return clean;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingItem.id;
    const url = isNew
      ? "/api/featured-projects"
      : `/api/featured-projects/${editingItem.id}`;
    const method = isNew ? "POST" : "PUT";

    const payload = {
      ...editingItem,
      image: cleanImageForSave(editingItem.image || ""),
    };

    toast.promise(
      fetch(url, {
        method,
        body: JSON.stringify(payload),
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
      setEditingItem((prev) => ({ ...prev, category: val }));
    } else {
      setEditingItem((prev) => ({ ...prev, category_en: val }));
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
          {/* Project selector */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Proyecto de referencia
            </label>
            <select
              value={selectedProjectId ?? ""}
              onChange={(e) => selectProject(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            >
              <option value="">-- Seleccionar proyecto --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.company}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Título"
            value={editingItem.title || ""}
            onChange={(e: any) =>
              setEditingItem((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
          <Input
            label="Cliente"
            value={editingItem.client || ""}
            onChange={(e: any) =>
              setEditingItem((prev) => ({ ...prev, client: e.target.value }))
            }
            required
          />
          <Input
            label={`Categoría (${lang})`}
            value={currentCategoryValue}
            onChange={(e: any) => handleCategoryChange(e.target.value)}
            required={lang === "es"}
            placeholder={
              lang === "es" ? "Ej: Plataforma Web" : "Ex: Web Platform"
            }
          />

          {/* Image selector */}
          {projectImages.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Seleccionar imagen destacada
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {projectImages.map(({ filename, folder }) => {
                  const imagePath = `projectImages/${folder}/${filename}`;
                  const isSelected = editingItem.image === imagePath;
                  return (
                    <button
                      type="button"
                      key={filename}
                      onClick={() =>
                        setEditingItem((prev) => ({ ...prev, image: imagePath }))
                      }
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        isSelected
                          ? "border-black ring-2 ring-black/20"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={`${import.meta.env.BASE_URL}images/${imagePath}`}
                        alt={filename}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {editingItem.image && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <img
                src={`${import.meta.env.BASE_URL}images/${editingItem.image}`}
                alt="preview"
                className="w-16 h-10 object-cover rounded"
              />
              <span className="text-xs text-gray-500 truncate flex-1">
                {editingItem.image}
              </span>
              <button
                type="button"
                onClick={() =>
                  setEditingItem((prev) => ({ ...prev, image: "" }))
                }
                className="text-xs text-red-500 hover:text-red-700"
              >
                Quitar
              </button>
            </div>
          )}

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
