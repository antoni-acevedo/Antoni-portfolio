import React, { useEffect, useState, useRef } from "react";
import type { ProjectData } from "../MyProjects";
import { Button, Input, TextArea, Card, Modal } from "./UI";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ChevronUp, ChevronDown, Upload, FolderPlus, Image as ImageIcon } from "lucide-react";

export default function ProjectsManager() {
  const [items, setItems] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ProjectData>>({});
  const [lang, setLang] = useState<"es" | "en">("es");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [folders, setFolders] = useState<{ name: string; count: number }[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [folderImages, setFolderImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isNewFolder, setIsNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [viewingItem, setViewingItem] = useState<ProjectData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BASE = import.meta.env.BASE_URL;

  const fetchItems = () => {
    fetch("/api/projects")
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
    if (!isModalOpen) {
      setSelectedFolder("");
      setSelectedImages([]);
      setTags([]);
      setTagInput("");
      setIsNewFolder(false);
      setNewFolderName("");
      setFolderImages([]);
    }
  }, [isModalOpen]);

  useEffect(() => {
    fetch("/api/images/list")
      .then((res) => res.json())
      .then((data) => setFolders(data.folders || []));
  }, [isModalOpen]);

  useEffect(() => {
    if (selectedFolder) {
      fetch(`/api/images/list?folder=${encodeURIComponent(selectedFolder)}`)
        .then((res) => res.json())
        .then((data) => setFolderImages(data.images || []));
    } else {
      setFolderImages([]);
    }
  }, [selectedFolder]);

  const handleEdit = (item: ProjectData) => {
    setEditingItem({ ...item });
    setTags(item.tags);

    const firstImg = item.images[0] || "";
    const folderMatch = firstImg.match(/projectImages\/([^/]+)/);
    setSelectedFolder(folderMatch ? folderMatch[1] : "");

    setSelectedImages(
      item.images
        .map((img) => {
          const parts = img.split("/");
          return parts[parts.length - 1];
        })
        .filter(Boolean),
    );

    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingItem({});
    setTags([]);
    setSelectedFolder("");
    setSelectedImages([]);
    setIsNewFolder(false);
    setNewFolderName("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    toast.promise(fetch(`/api/projects/${id}`, { method: "DELETE" }), {
      loading: "Eliminando...",
      success: () => {
        setTimeout(() => window.location.reload(), 1000);
        return "Proyecto eliminado correctamente";
      },
      error: "Error al eliminar",
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingItem.id;
    const url = isNew ? "/api/projects" : `/api/projects/${editingItem.id}`;
    const method = isNew ? "POST" : "PUT";

    const payload = {
      ...editingItem,
      tags,
      images: selectedImages.map(
        (img) => `projectImages/${selectedFolder}/${img}`,
      ),
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
          return "Proyecto guardado correctamente";
        },
        error: "Error al guardar",
      },
    );
  };

  const handleTextChange = (field: keyof ProjectData, value: string) => {
    const key = lang === "es" ? field : (`${field}_en` as keyof ProjectData);
    setEditingItem({ ...editingItem, [key]: value });
  };

  const getValue = (field: keyof ProjectData) => {
    const key = lang === "es" ? field : (`${field}_en` as keyof ProjectData);
    return (editingItem[key] as string) || "";
  };

  const getImageUrl = (name: string) => {
    if (!name) return "";
    if (name.startsWith("http") || name.startsWith("data:")) return name;
    const cleanName = name
      .replace("src/assets/projectImages/", "projectImages/")
      .replace("src/assets/", "")
      .replace(/^\//, "");
    return `${BASE}images/${cleanName}`;
  };

  const getDisplayValue = (item: ProjectData, field: keyof ProjectData) => {
    const key = lang === "es" ? field : (`${field}_en` as keyof ProjectData);
    return (item[key] as string) || (item[field] as string) || "";
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const targetFolder = selectedFolder || newFolderName || editingItem.company || "untitled";
    setUploading(true);

    const formData = new FormData();
    formData.set("folder", targetFolder);
    for (const f of files) {
      formData.append("files", f);
    }

    try {
      const res = await fetch("/api/images/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.uploaded?.length) {
        toast.success(`${data.uploaded.length} imagen(es) subida(s)`);
        if (!selectedFolder) setSelectedFolder(targetFolder);
        setFolderImages((prev) =>
          [...new Set([...data.uploaded, ...prev])].sort(),
        );
      }
    } catch {
      toast.error("Error al subir imágenes");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const toggleImage = (img: string) => {
    setSelectedImages((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img],
    );
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const newOrder = [...selectedImages];
    const target = index + direction;
    if (target < 0 || target >= newOrder.length) return;
    [newOrder[index], newOrder[target]] = [newOrder[target], newOrder[index]];
    setSelectedImages(newOrder);
  };

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    setSelectedFolder(name);
    setIsNewFolder(false);
    setNewFolderName("");
  };

  const handleViewDetails = (item: ProjectData) => {
    setViewingItem(item);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Proyectos</h2>
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
          <Button onClick={handleCreate}>+ Nuevo Proyecto</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence>
          {items.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col md:flex-row gap-6 relative group"
            >
              <div className="w-full md:w-48 aspect-video bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <img
                  src={getImageUrl(item.images[0])}
                  alt={item.company}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl">{item.company}</h3>
                    <p className="text-sm font-medium text-gray-500">
                      {getDisplayValue(item, "role")} • {item.date}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="bg-gray-100 text-xs px-2 py-1 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mt-2">
                  {getDisplayValue(item, "desc")}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="ghost"
                    className="text-sm border border-gray-200"
                    onClick={() => handleViewDetails(item)}
                  >
                    Detalles
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-sm border border-gray-200"
                    onClick={() => handleEdit(item)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-sm text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(item.id)}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </AnimatePresence>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingItem.id
            ? `Editar Proyecto (${lang})`
            : `Nuevo Proyecto (${lang})`
        }
      >
        <form
          onSubmit={handleSave}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Input
            label="Título del Proyecto"
            value={editingItem.company || ""}
            onChange={(e: any) =>
              setEditingItem({ ...editingItem, company: e.target.value })
            }
            required
            className="md:col-span-2"
          />
          <Input
            label={`Rol (${lang})`}
            value={getValue("role")}
            onChange={(e: any) => handleTextChange("role", e.target.value)}
            required={lang === "es"}
          />
          <Input
            label="Fecha"
            value={editingItem.date || ""}
            onChange={(e: any) =>
              setEditingItem({ ...editingItem, date: e.target.value })
            }
            required
          />
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-600">Tags</label>
            <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all min-h-[2.75rem]">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 bg-gray-100 text-sm px-2.5 py-1 rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((_, idx) => idx !== i))}
                    className="hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    const val = tagInput.trim();
                    if (val && !tags.includes(val)) {
                      setTags((prev) => [...prev, val]);
                    }
                    setTagInput("");
                  }
                  if (e.key === "Backspace" && !tagInput && tags.length) {
                    setTags((prev) => prev.slice(0, -1));
                  }
                }}
                placeholder={tags.length ? "" : "Escribe una tag y presiona Enter"}
                className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
              />
            </div>
          </div>

          {/* Image Manager */}
          <div className="md:col-span-2 space-y-4">
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Gestión de Imágenes
              </h4>

              {/* Folder Selector */}
              <div className="flex gap-2 mb-4">
                {!isNewFolder ? (
                  <>
                    <select
                      value={selectedFolder}
                      onChange={(e) => setSelectedFolder(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                    >
                      <option value="">
                        -- Seleccionar carpeta --
                      </option>
                      {folders.map((f) => (
                        <option key={f.name} value={f.name}>
                          {f.name} ({f.count} img)
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="secondary"
                      className="text-sm"
                      onClick={() => {
                        setIsNewFolder(true);
                        setNewFolderName(editingItem.company || "");
                      }}
                    >
                      <FolderPlus className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Nombre de la carpeta"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="primary"
                      className="text-sm"
                      onClick={handleCreateFolder}
                    >
                      Crear
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-sm"
                      onClick={() => setIsNewFolder(false)}
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </div>

              {/* Upload */}
              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                  onChange={handleUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="text-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? "Subiendo..." : "Subir imágenes"}
                </Button>
              </div>

              {/* Image Grid */}
              {selectedFolder && folderImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  {folderImages.map((img) => {
                    const isSelected = selectedImages.includes(img);
                    return (
                      <button
                        type="button"
                        key={img}
                        onClick={() => toggleImage(img)}
                        className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                          isSelected
                            ? "border-black ring-2 ring-black/20"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={`${BASE}images/projectImages/${selectedFolder}/${img}`}
                          alt={img}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {selectedImages.indexOf(img) + 1}
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 truncate text-center">
                          {img}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : selectedFolder ? (
                <p className="text-sm text-gray-400 mb-4">
                  No hay imágenes en esta carpeta. Sube algunas.
                </p>
              ) : null}

              {/* Selected Images Order */}
              {selectedImages.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Imágenes seleccionadas ({selectedImages.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedImages.map((img, i) => (
                      <div
                        key={img}
                        className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs"
                      >
                        <span className="font-medium text-gray-500 min-w-[1rem]">
                          {i + 1}.
                        </span>
                        <span className="truncate max-w-[120px]">{img}</span>
                        <button
                          type="button"
                          onClick={() => moveImage(i, -1)}
                          disabled={i === 0}
                          className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
                        >
                          <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(i, 1)}
                          disabled={i === selectedImages.length - 1}
                          className="p-0.5 hover:bg-gray-100 rounded disabled:opacity-30"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedImages((prev) =>
                              prev.filter((_, idx) => idx !== i),
                            )
                          }
                          className="p-0.5 hover:bg-red-50 text-red-400 hover:text-red-600 rounded ml-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <TextArea
            label={`Descripción Corta (${lang})`}
            value={getValue("desc")}
            onChange={(e: any) => handleTextChange("desc", e.target.value)}
            rows={2}
            className="md:col-span-2"
            required={lang === "es"}
          />
          <TextArea
            label={`Descripción Larga (${lang})`}
            value={getValue("long_desc")}
            onChange={(e: any) => handleTextChange("long_desc", e.target.value)}
            rows={4}
            className="md:col-span-2"
            required={lang === "es"}
          />

          <div className="flex justify-end gap-2 mt-4 md:col-span-2">
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

      {/* Detail Modal */}
      <Modal
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
        title={viewingItem?.company || "Detalles del Proyecto"}
      >
        {viewingItem && (
          <div className="space-y-6">
            <div className="text-sm text-gray-500 font-medium">
              {viewingItem.date}
            </div>

            {/* Bilingual fields side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-xs uppercase tracking-wide text-gray-400">
                  Español
                </h4>
                <div>
                  <p className="text-xs text-gray-400">Rol</p>
                  <p className="font-medium">{viewingItem.role}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Descripción Corta</p>
                  <p className="text-gray-700">{viewingItem.desc}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Descripción Larga</p>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {viewingItem.long_desc}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-xs uppercase tracking-wide text-gray-400">
                  English
                </h4>
                <div>
                  <p className="text-xs text-gray-400">Role</p>
                  <p className="font-medium">
                    {viewingItem.role_en || viewingItem.role}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Short Description</p>
                  <p className="text-gray-700">
                    {viewingItem.desc_en || viewingItem.desc}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Long Description</p>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {viewingItem.long_desc_en || viewingItem.long_desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {viewingItem.tags.map((t) => (
                  <span
                    key={t}
                    className="bg-gray-100 text-sm px-3 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">
                Imágenes ({viewingItem.images.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {viewingItem.images.map((img, i) => (
                  <a
                    key={i}
                    href={getImageUrl(img)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-video bg-gray-100 rounded-lg overflow-hidden hover:ring-2 hover:ring-black transition-all"
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${viewingItem.company} ${i + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setViewingItem(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
