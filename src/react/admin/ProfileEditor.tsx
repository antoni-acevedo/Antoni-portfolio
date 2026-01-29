import React, { useEffect, useState } from "react";
import type { ProfileData } from "../About";
import { Button, Input, TextArea } from "./UI";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  User,
  Image as ImageIcon,
  Star,
  AlignLeft,
  Sparkles,
  Save,
} from "lucide-react";

export default function ProfileEditor() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState<"es" | "en">("es");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    setSaving(false);
    toast.success("Perfil actualizado correctamente");
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleTextChange = (field: keyof ProfileData, value: string) => {
    if (!data) return;
    const key = lang === "es" ? field : (`${field}_en` as keyof ProfileData);
    setData({ ...data, [key]: value });
  };

  const getValue = (field: keyof ProfileData) => {
    if (!data) return "";
    const key = lang === "es" ? field : (`${field}_en` as keyof ProfileData);
    return (data[key] as string) || "";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );

  if (!data) return <div>Error loading profile</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-black text-white p-3 rounded-2xl">
            <User size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Editar Perfil</h2>
            <p className="text-gray-500 text-sm">
              Gestiona la información principal de tu presentación
            </p>
          </div>
        </div>
        <div className="flex gap-3">
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
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-6"
          >
            <Save size={18} />
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left Column: Main Info */}
        {/* Left Column: Main Info */}
        <div className="lg:col-span-8 space-y-8">
          {/* General Info Card */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-2">
              <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                <AlignLeft size={20} />
              </div>
              <h3 className="font-bold text-lg">
                Información General ({lang.toUpperCase()})
              </h3>
            </div>

            <div className="grid gap-6">
              <Input
                label={`Título Principal (${lang})`}
                value={getValue("title")}
                onChange={(e: any) => handleTextChange("title", e.target.value)}
                placeholder="Ej: Sobre Mí"
                className="text-lg font-medium"
              />
              <TextArea
                label={`Descripción Corta (${lang})`}
                value={getValue("description")}
                onChange={(e: any) =>
                  handleTextChange("description", e.target.value)
                }
                rows={4}
                className="leading-relaxed"
              />
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <Input
                  label={`Texto Destacado (${lang})`}
                  value={getValue("highlight_text")}
                  onChange={(e: any) =>
                    handleTextChange("highlight_text", e.target.value)
                  }
                  className="font-medium text-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Bullet Points */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-2">
              <div className="bg-yellow-50 text-yellow-600 p-2 rounded-xl">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-lg">
                Puntos Clave ({lang.toUpperCase()})
              </h3>
            </div>
            <div className="grid gap-6">
              <TextArea
                label={`Punto Clave #1 (${lang})`}
                value={getValue("bullet_1")}
                onChange={(e: any) =>
                  handleTextChange("bullet_1", e.target.value)
                }
                rows={2}
              />
              <TextArea
                label={`Punto Clave #2 (${lang})`}
                value={getValue("bullet_2")}
                onChange={(e: any) =>
                  handleTextChange("bullet_2", e.target.value)
                }
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Stats & Images */}
        <div className="lg:col-span-4 space-y-8">
          {/* Stats */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-2">
              <div className="bg-purple-50 text-purple-600 p-2 rounded-xl">
                <Star size={20} />
              </div>
              <h3 className="font-bold text-lg">Estadísticas</h3>
            </div>
            <Input
              type="number"
              label="Años de Experiencia"
              value={data.years_experience}
              onChange={(e: any) =>
                setData({ ...data, years_experience: parseInt(e.target.value) })
              }
              className="text-3xl font-bold text-center"
            />
            <TextArea
              label={`Texto Descriptivo (${lang})`}
              value={getValue("experience_text")}
              onChange={(e: any) =>
                handleTextChange("experience_text", e.target.value)
              }
              rows={3}
              className="text-sm text-gray-600"
            />
          </div>

          {/* Images */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-2">
              <div className="bg-pink-50 text-pink-600 p-2 rounded-xl">
                <ImageIcon size={20} />
              </div>
              <h3 className="font-bold text-lg">Imágenes</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  label="Foto Perfil (filename)"
                  value={data.profile_image}
                  onChange={(e: any) =>
                    setData({ ...data, profile_image: e.target.value })
                  }
                />
                {data.profile_image && (
                  <div className="mt-2 rounded-xl overflow-hidden aspect-square w-20 bg-gray-100 border border-gray-200">
                    <img
                      src={`${import.meta.env.BASE_URL}images/${data.profile_image}`}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}
              </div>

              <hr className="border-gray-100" />

              <div>
                <Input
                  label="Foto Secundaria (filename)"
                  value={data.secondary_image}
                  onChange={(e: any) =>
                    setData({ ...data, secondary_image: e.target.value })
                  }
                />
                {data.secondary_image && (
                  <div className="mt-2 rounded-xl overflow-hidden aspect-square w-20 bg-gray-100 border border-gray-200">
                    <img
                      src={`${import.meta.env.BASE_URL}images/${data.secondary_image}`}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
