import React, { useEffect, useState, useRef } from "react";
import type { ProjectData } from "../MyProjects";
import { Button, Card, Modal } from "./UI";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  X,
  Upload,
  FolderPlus,
  Image as ImageIcon,
} from "lucide-react";

export default function ProjectsManager() {
  const [items, setItems] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ProjectData>>({});
  const [lang, setLang] = useState<"es" | "en">("es");
  const [tags, setTags] = useState<string[]>([]);

  const [folders, setFolders] = useState<{ name: string; count: number }[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [folderImages, setFolderImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isNewFolder, setIsNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [viewingItem, setViewingItem] = useState<ProjectData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UX state
  const [formChanged, setFormChanged] = useState(false);
  const [previewLang, setPreviewLang] = useState<"es" | "en">("es");
  const initialFormRef = useRef<string>("");
  const [dragging, setDragging] = useState(false);

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
      setIsNewFolder(false);
      setNewFolderName("");
      setFolderImages([]);
      setFormChanged(false);
      initialFormRef.current = "";
    } else {
      // Snapshot the initial form state once the modal opens, for dirty detection.
      setTimeout(() => {
        initialFormRef.current = JSON.stringify({
          company: editingItem.company || "",
          role: editingItem.role || "",
          role_en: editingItem.role_en || "",
          date: editingItem.date || "",
          desc: editingItem.desc || "",
          desc_en: editingItem.desc_en || "",
          long_desc: editingItem.long_desc || "",
          long_desc_en: editingItem.long_desc_en || "",
          tags,
          images: selectedImages,
        });
      }, 0);
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

  // Auto-fill UX: when picking an existing folder on a new project,
  // prefill the company field if empty.
  useEffect(() => {
    if (!isModalOpen) return;
    if (!selectedFolder) return;
    if (editingItem.id) return; // only on create
    if (!editingItem.company || !editingItem.company.trim()) {
      setEditingItem((prev) => ({ ...prev, company: selectedFolder }));
    }
  }, [selectedFolder, isModalOpen]);

  // Dirty-form detection (live tracking of edits vs initial snapshot)
  useEffect(() => {
    if (!isModalOpen || !initialFormRef.current) return;
    const current = JSON.stringify({
      company: editingItem.company || "",
      role: editingItem.role || "",
      role_en: editingItem.role_en || "",
      date: editingItem.date || "",
      desc: editingItem.desc || "",
      desc_en: editingItem.desc_en || "",
      long_desc: editingItem.long_desc || "",
      long_desc_en: editingItem.long_desc_en || "",
      tags,
      images: selectedImages,
    });
    setFormChanged(current !== initialFormRef.current);
  }, [
    editingItem,
    tags,
    selectedImages,
    isModalOpen,
  ]);

  // Keyboard shortcuts: Ctrl/Cmd+S to save, Esc to close
  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        const form = document.querySelector<HTMLFormElement>("form[data-projects-form]");
        form?.requestSubmit();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, formChanged]);

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

  const handleClose = () => {
    if (formChanged && !confirm("Tienes cambios sin guardar. ¿Salir de todos modos?")) {
      return;
    }
    setIsModalOpen(false);
  };

  const isFormValid = (() => {
    if (!editingItem.company || !editingItem.company.trim()) return false;
    if (!editingItem.role || !editingItem.role.trim()) return false;
    if (!editingItem.date || !editingItem.date.trim()) return false;
    if (selectedImages.length === 0) return false;
    if (tags.length === 0) return false;
    return true;
  })();

  const requirements = [
    { label: "Título", ok: !!editingItem.company?.trim() },
    { label: "Al menos 1 rol (es)", ok: !!editingItem.role?.trim() },
    { label: "Fecha", ok: !!editingItem.date?.trim() },
    { label: "Al menos 1 imagen", ok: selectedImages.length > 0 },
    { label: "Al menos 1 tag", ok: tags.length > 0 },
  ];

  // Quick date helpers — keep the existing free-text format the DB already uses.
  const now = new Date();
  const monthNamesEs = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ];
  const toIso = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };
  const setDateThisMonth = () => {
    const v = `${monthNamesEs[now.getMonth()]} ${now.getFullYear()}`;
    setEditingItem({ ...editingItem, date: v });
  };
  const setDateToday = () => {
    setEditingItem({ ...editingItem, date: toIso(now) });
  };

  // Date parsing — supports ISO (YYYY-MM-DD), ranges ("YYYY-MM-DD — YYYY-MM-DD" / " - " / " / ")
  // and legacy free-text values that don't match ISO.
  const dateRangeRegex =
    /^(\d{4}-\d{2}-\d{2})\s*(?:—|--|-|\/)\s*(\d{4}-\d{2}-\d{2})$/;
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const parseDateValue = (raw: string | undefined) => {
    const v = (raw || "").trim();
    if (!v) return { start: "", end: "", mode: "single" as const, isLegacy: false };
    const m = v.match(dateRangeRegex);
    if (m) return { start: m[1], end: m[2], mode: "range" as const, isLegacy: false };
    if (isoDateRegex.test(v)) return { start: v, end: "", mode: "single" as const, isLegacy: false };
    return { start: "", end: "", mode: "single" as const, isLegacy: true, legacy: v };
  };
  const parsedDate = parseDateValue(editingItem.date);
  const dateMode = parsedDate.mode;
  const setDateStart = (start: string) => {
    const next = dateMode === "range" && parsedDate.end
      ? `${start} — ${parsedDate.end}`
      : start;
    setEditingItem({ ...editingItem, date: next });
  };
  const setDateEnd = (end: string) => {
    const next = parsedDate.start
      ? `${parsedDate.start} — ${end}`
      : end;
    setEditingItem({ ...editingItem, date: next });
  };
  const setDateMode = (mode: "single" | "range") => {
    if (mode === "single" && parsedDate.end) {
      setEditingItem({ ...editingItem, date: parsedDate.start || "" });
    } else if (mode === "range" && !parsedDate.end && parsedDate.start) {
      setEditingItem({ ...editingItem, date: `${parsedDate.start} — ${parsedDate.start}` });
    }
  };

  // Single upload path for button + drag-and-drop. Uploaded images are
  // auto-selected so the user doesn't have to click each one afterwards.
  const uploadFiles = async (files: FileList | File[] | null) => {
    const list = Array.from(files || []).filter((f) => f.type.startsWith("image/"));
    if (list.length === 0) return;
    const targetFolder =
      selectedFolder || newFolderName || editingItem.company || "untitled";
    setUploading(true);
    const formData = new FormData();
    formData.set("folder", targetFolder);
    for (const f of list) formData.append("files", f);
    try {
      const res = await fetch("/api/images/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.uploaded?.length) {
        toast.success(`${data.uploaded.length} imagen(es) subida(s)`);
        if (!selectedFolder) setSelectedFolder(targetFolder);
        setFolderImages((prev) =>
          [...new Set([...data.uploaded, ...prev])].sort(),
        );
        setSelectedImages((prev) => [
          ...prev,
          ...(data.uploaded as string[]).filter((n) => !prev.includes(n)),
        ]);
      } else {
        toast.error("No se subió ninguna imagen");
      }
    } catch {
      toast.error("Error al subir imágenes");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Most-used tags across existing projects, minus the ones already added.
  const tagSuggestions = Object.entries(
    items.flatMap((i) => i.tags).reduce<Record<string, number>>((acc, t) => {
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {}),
  )
    .filter(([t]) => !tags.includes(t))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([t]) => t);

  // Roles are edited as a list but stored as one string ("A - B"), the
  // format the DB and the public site already use.
  const ROLE_SEP = " - ";
  const splitRoles = (v: string) =>
    v.split(ROLE_SEP).map((r) => r.trim()).filter(Boolean);
  const roles = splitRoles(
    (lang === "es" ? editingItem.role : editingItem.role_en) || "",
  );
  const roleSuggestions = Object.entries(
    items
      .flatMap((i) => splitRoles((lang === "es" ? i.role : i.role_en) || ""))
      .reduce<Record<string, number>>((acc, r) => {
        acc[r] = (acc[r] || 0) + 1;
        return acc;
      }, {}),
  )
    .filter(([r]) => !roles.includes(r))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([r]) => r);

  const copyEsToEn = () => {
    setEditingItem((prev) => ({
      ...prev,
      role_en: prev.role_en || prev.role,
      desc_en: prev.desc_en || prev.desc,
      long_desc_en: prev.long_desc_en || prev.long_desc,
    }));
    toast.success("Campos vacíos de EN rellenados desde ES");
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
        onClose={handleClose}
        size="max-w-6xl"
        title={editingItem.id ? "Editar proyecto" : "Nuevo proyecto"}
      >
        <form
          onSubmit={handleSave}
          data-projects-form
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6"
        >
          {/* ───────── Columna principal ───────── */}
          <div className="space-y-5 min-w-0">
            {/* 1 · Información */}
            <Section step={1} title="Información básica">
              <div className="grid grid-cols-1 gap-4">
                <Field label="Título del proyecto" required right={`${(editingItem.company || "").length}/60`}>
                  <input
                    className={inputCls}
                    value={editingItem.company || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, company: e.target.value })
                    }
                    placeholder="Ej. zoe-american-method"
                    maxLength={60}
                    required
                    autoFocus
                  />
                </Field>

                <Field
                  label="Fecha"
                  required
                  right={
                    <Segmented
                      value={dateMode}
                      onChange={setDateMode}
                      options={[
                        { value: "single", label: "Puntual" },
                        { value: "range", label: "Rango" },
                      ]}
                    />
                  }
                >
                  {parsedDate.isLegacy ? (
                    <div className="space-y-2">
                      <input
                        className={`${inputCls} !border-amber-300 !bg-amber-50`}
                        required
                        value={editingItem.date || ""}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, date: e.target.value })
                        }
                        placeholder="Texto libre (formato legacy)"
                        maxLength={40}
                      />
                      <p className="text-xs text-amber-700">
                        Valor antiguo detectado.{" "}
                        <button
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, date: "" })}
                          className="text-blue-600 hover:underline"
                        >
                          Limpiar y usar el selector
                        </button>
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        required
                        className={inputCls}
                        value={parsedDate.start}
                        onChange={(e) => setDateStart(e.target.value)}
                      />
                      {dateMode === "range" && (
                        <>
                          <span className="text-gray-300">→</span>
                          <input
                            type="date"
                            className={inputCls}
                            value={parsedDate.end}
                            min={parsedDate.start || undefined}
                            onChange={(e) => setDateEnd(e.target.value)}
                          />
                        </>
                      )}
                      <button
                        type="button"
                        title="Establecer a hoy"
                        onClick={setDateToday}
                        className="shrink-0 px-3 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Hoy
                      </button>
                    </div>
                  )}
                </Field>

                <Field label="Tags" required right={`${tags.length} añadida(s)`}>
                  <ChipInput
                    values={tags}
                    onChange={setTags}
                    suggestions={tagSuggestions}
                    placeholder="Escribe y pulsa Enter o coma"
                  />
                </Field>
              </div>
            </Section>

            {/* 2 · Imágenes */}
            <Section
              step={2}
              title="Imágenes"
              hint="La primera será la portada"
            >
              <div className="space-y-4">
                {/* Carpeta */}
                <div className="flex gap-2">
                  {!isNewFolder ? (
                    <>
                      <select
                        value={selectedFolder}
                        onChange={(e) => setSelectedFolder(e.target.value)}
                        className={inputCls}
                      >
                        <option value="">Selecciona una carpeta…</option>
                        {folders.map((f) => (
                          <option key={f.name} value={f.name}>
                            {f.name} ({f.count} img)
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        title="Nueva carpeta"
                        onClick={() => {
                          setIsNewFolder(true);
                          setNewFolderName(editingItem.company || "");
                        }}
                        className="shrink-0 inline-flex items-center gap-1.5 px-3.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        <FolderPlus className="w-4 h-4" />
                        Nueva
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Nombre de la carpeta"
                        className={inputCls}
                        autoFocus
                      />
                      <Button type="button" variant="primary" className="shrink-0 text-sm !rounded-xl" onClick={handleCreateFolder}>
                        Crear
                      </Button>
                      <Button type="button" variant="ghost" className="shrink-0 text-sm !rounded-xl" onClick={() => setIsNewFolder(false)}>
                        Cancelar
                      </Button>
                    </>
                  )}
                </div>

                {/* Zona de subida */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                  onChange={(e) => uploadFiles(e.target.files)}
                  className="hidden"
                />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (!uploading) fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    uploadFiles(e.dataTransfer.files);
                  }}
                  className={`flex flex-col items-center justify-center gap-1.5 py-7 rounded-2xl border-2 border-dashed cursor-pointer text-center transition-all ${
                    dragging
                      ? "border-black bg-white scale-[1.01]"
                      : "border-gray-300 bg-white/60 hover:border-gray-500 hover:bg-white"
                  } ${uploading ? "opacity-60 cursor-wait" : ""}`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-gray-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {uploading ? "Subiendo…" : "Arrastra tus imágenes aquí"}
                  </p>
                  <p className="text-xs text-gray-400">
                    o haz clic para elegirlas · PNG, JPG, WEBP, GIF, SVG
                  </p>
                </div>

                {/* Galería de la carpeta */}
                {selectedFolder && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" />
                        {selectedFolder} · {folderImages.length} imagen(es)
                      </p>
                      {folderImages.length > 0 && (
                        <div className="flex gap-3 text-xs">
                          <button
                            type="button"
                            className="text-blue-600 hover:underline"
                            onClick={() =>
                              setSelectedImages((prev) => [
                                ...prev,
                                ...folderImages.filter((i) => !prev.includes(i)),
                              ])
                            }
                          >
                            Seleccionar todas
                          </button>
                          <button
                            type="button"
                            className="text-gray-500 hover:underline"
                            onClick={() => setSelectedImages([])}
                          >
                            Limpiar
                          </button>
                        </div>
                      )}
                    </div>
                    {folderImages.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                        {folderImages.map((img) => {
                          const idx = selectedImages.indexOf(img);
                          const isSelected = idx !== -1;
                          return (
                            <button
                              type="button"
                              key={img}
                              onClick={() => toggleImage(img)}
                              title={img}
                              className={`group relative aspect-video rounded-lg overflow-hidden transition-all ${
                                isSelected
                                  ? "ring-2 ring-black ring-offset-1"
                                  : "opacity-80 hover:opacity-100 ring-1 ring-gray-200"
                              }`}
                            >
                              <img
                                src={`${BASE}images/projectImages/${selectedFolder}/${img}`}
                                alt={img}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                              {isSelected && (
                                <span className="absolute top-1 right-1 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                                  {idx + 1}
                                </span>
                              )}
                              <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                {img}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">
                        Esta carpeta está vacía. Sube algunas imágenes.
                      </p>
                    )}
                  </div>
                )}

                {/* Orden de las seleccionadas */}
                {selectedImages.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Orden de publicación ({selectedImages.length})
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedImages.map((img, i) => (
                        <div
                          key={img}
                          className={`shrink-0 w-32 rounded-xl overflow-hidden border bg-white ${
                            i === 0 ? "border-amber-400 ring-1 ring-amber-300" : "border-gray-200"
                          }`}
                        >
                          <div className="relative aspect-video bg-gray-100">
                            <img
                              src={`${BASE}images/projectImages/${selectedFolder}/${img}`}
                              alt={img}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-semibold">
                              {i === 0 ? "★ Portada" : `#${i + 1}`}
                            </span>
                          </div>
                          <div className="flex items-center justify-between px-1 py-1">
                            <button
                              type="button"
                              onClick={() => moveImage(i, -1)}
                              disabled={i === 0}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-25"
                              aria-label="Mover a la izquierda"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedImages((prev) => prev.filter((_, idx) => idx !== i))
                              }
                              className="p-1 rounded text-red-400 hover:text-red-600 hover:bg-red-50"
                              aria-label="Quitar imagen"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImage(i, 1)}
                              disabled={i === selectedImages.length - 1}
                              className="p-1 rounded hover:bg-gray-100 disabled:opacity-25"
                              aria-label="Mover a la derecha"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Section>

            {/* 3 · Contenido */}
            <Section
              step={3}
              title="Contenido"
              action={
                <Segmented
                  value={lang}
                  onChange={setLang}
                  options={[
                    { value: "es", label: "Español" },
                    { value: "en", label: "English" },
                  ]}
                />
              }
            >
              <div className="space-y-4">
                {lang === "en" && (
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-2.5">
                    <p className="text-xs text-blue-800">
                      Los campos en inglés vacíos usan el texto en español.
                    </p>
                    <button
                      type="button"
                      onClick={copyEsToEn}
                      className="shrink-0 text-xs font-medium text-blue-700 hover:underline"
                    >
                      Copiar ES → EN
                    </button>
                  </div>
                )}
                <Field
                  label={`Roles (${lang})`}
                  required={lang === "es"}
                  right={`${roles.length} añadido(s)`}
                >
                  <ChipInput
                    values={roles}
                    onChange={(next) => handleTextChange("role", next.join(ROLE_SEP))}
                    suggestions={roleSuggestions}
                    placeholder={
                      lang === "es" ? "Ej. Frontend, Backend…" : "e.g. Frontend, Backend…"
                    }
                  />
                </Field>
                <Field
                  label={`Descripción corta (${lang})`}
                  required={lang === "es"}
                  right={`${getValue("desc").length}/200`}
                >
                  <textarea
                    className={`${inputCls} resize-y`}
                    rows={2}
                    value={getValue("desc")}
                    onChange={(e) => handleTextChange("desc", e.target.value)}
                    required={lang === "es"}
                    maxLength={200}
                  />
                </Field>
                <Field
                  label={`Descripción larga (${lang})`}
                  required={lang === "es"}
                  right={`${getValue("long_desc").length}/1000`}
                >
                  <textarea
                    className={`${inputCls} resize-y`}
                    rows={5}
                    value={getValue("long_desc")}
                    onChange={(e) => handleTextChange("long_desc", e.target.value)}
                    required={lang === "es"}
                    maxLength={1000}
                  />
                </Field>
              </div>
            </Section>
          </div>

          {/* ───────── Columna lateral: vista previa + checklist ───────── */}
          <aside className="lg:sticky lg:top-24 self-start space-y-4 min-w-0">
            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  Vista previa
                </h4>
                <Segmented
                  value={previewLang}
                  onChange={setPreviewLang}
                  options={[
                    { value: "es", label: "ES" },
                    { value: "en", label: "EN" },
                  ]}
                />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {selectedImages[0] && selectedFolder ? (
                  <img
                    src={`${BASE}images/projectImages/${selectedFolder}/${selectedImages[0]}`}
                    alt="preview"
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <div className="p-4 space-y-2">
                  <div>
                    <h5 className="text-lg font-semibold tracking-tight break-words">
                      {editingItem.company ||
                        (previewLang === "es" ? "Título del proyecto" : "Project title")}
                    </h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {previewLang === "es"
                        ? `${editingItem.role || "Rol"} • ${editingItem.date || "Fecha"}`
                        : `${editingItem.role_en || editingItem.role || "Role"} • ${editingItem.date || "Date"}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tags.length === 0 ? (
                      <span className="text-xs text-gray-300">Sin tags</span>
                    ) : (
                      tags.map((t) => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {t}
                        </span>
                      ))
                    )}
                  </div>
                  <p className="text-sm text-gray-600 italic">
                    {previewLang === "es"
                      ? editingItem.desc || "Descripción corta…"
                      : editingItem.desc_en || editingItem.desc || "Short description…"}
                  </p>
                  <p className="text-xs text-gray-500 whitespace-pre-wrap line-clamp-6">
                    {previewLang === "es"
                      ? editingItem.long_desc || "Descripción larga…"
                      : editingItem.long_desc_en || editingItem.long_desc || "Long description…"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 p-4">
              <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
                Para poder guardar
              </h4>
              <ul className="space-y-2">
                {requirements.map((r) => (
                  <li
                    key={r.label}
                    className={`flex items-center gap-2 text-sm ${r.ok ? "text-gray-400 line-through" : "text-gray-700"}`}
                  >
                    {r.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                    )}
                    {r.label}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* ───────── Barra de acciones ───────── */}
          <div className="lg:col-span-2 sticky bottom-0 -mx-6 -mb-6 px-6 py-3.5 bg-white/95 backdrop-blur border-t border-gray-100 flex flex-wrap justify-between items-center gap-3 rounded-b-3xl">
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              <span
                className={`inline-block w-2 h-2 rounded-full ${formChanged ? "bg-amber-400" : "bg-gray-300"}`}
              />
              {formChanged ? "Cambios sin guardar" : "Sin cambios"}
              <span className="hidden sm:inline">
                {" · "}
                <kbd className="px-1 py-0.5 bg-gray-100 rounded border border-gray-200">Ctrl</kbd>
                {" + "}
                <kbd className="px-1 py-0.5 bg-gray-100 rounded border border-gray-200">S</kbd>
              </span>
            </span>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!isFormValid}>
                Guardar proyecto
              </Button>
            </div>
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

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10";

function Section({
  step,
  title,
  hint,
  action,
  children,
}: {
  step: number;
  title: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
      <header className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs font-semibold flex items-center justify-center">
            {step}
          </span>
          <h4 className="font-semibold text-gray-900">{title}</h4>
          {hint && <span className="text-xs text-gray-400 hidden sm:inline">· {hint}</span>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  right,
  children,
}: {
  label: string;
  required?: boolean;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {right && <span className="text-xs text-gray-400">{right}</span>}
      </div>
      {children}
    </div>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex bg-gray-100 p-0.5 rounded-lg text-xs font-medium">
      {options.map((o) => (
        <button
          type="button"
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-md transition-all ${
            value === o.value
              ? "bg-white shadow-sm text-black"
              : "text-gray-500 hover:text-black"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function ChipInput({
  values,
  onChange,
  suggestions = [],
  placeholder,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const incoming = raw.split(/[,\n]/).map((t) => t.trim()).filter(Boolean);
    if (incoming.length) onChange([...new Set([...values, ...incoming])]);
  };
  const commit = () => {
    add(draft);
    setDraft("");
  };

  return (
    <>
      <div className="flex flex-wrap gap-1.5 p-2 border border-gray-200 rounded-xl bg-white focus-within:border-black focus-within:ring-2 focus-within:ring-black/10 transition min-h-[2.9rem]">
        {values.map((v, i) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 bg-gray-900 text-white text-xs pl-2.5 pr-1.5 py-1 rounded-full"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="opacity-60 hover:opacity-100 transition-opacity"
              aria-label={`Eliminar ${v}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onPaste={(e) => {
            const text = e.clipboardData.getData("text");
            if (/[,\n]/.test(text)) {
              e.preventDefault();
              add(text);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            }
            if (e.key === "Backspace" && !draft && values.length) {
              onChange(values.slice(0, -1));
            }
          }}
          placeholder={values.length ? "" : placeholder}
          className="flex-1 min-w-[140px] px-1.5 outline-none text-sm bg-transparent"
        />
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span className="text-xs text-gray-400">Sugeridas:</span>
          {suggestions.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => add(t)}
              className="text-xs px-2.5 py-1 rounded-full border border-dashed border-gray-300 text-gray-600 hover:border-black hover:text-black transition-colors"
            >
              + {t}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
