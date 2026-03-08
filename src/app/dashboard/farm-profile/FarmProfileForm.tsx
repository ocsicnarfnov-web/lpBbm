"use client";

import { useState } from "react";
import { saveFarmProfile } from "./actions";
import { Save, Upload, Building2, MapPin } from "lucide-react";

interface FarmProfileFormProps {
  profile: {
    id: number;
    farmName: string;
    farmAddress: string;
    logoUrl: string | null;
  } | undefined;
  canEdit: boolean;
}

export default function FarmProfileForm({ profile, canEdit }: FarmProfileFormProps) {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(profile?.logoUrl || "");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    setSuccess("");
    const result = await saveFarmProfile(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess("Farm profile saved successfully!");
    }
    setLoading(false);
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  if (!canEdit && !profile) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Building2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
        <p>Farm profile not set up yet. Contact admin.</p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Logo
        </label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-green-300 flex items-center justify-center overflow-hidden bg-green-50">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
            ) : (
              <Upload className="w-8 h-8 text-green-300" />
            )}
          </div>
          {canEdit && (
            <div>
              <label className="btn-secondary cursor-pointer flex items-center gap-2 text-sm">
                <Upload className="w-4 h-4" />
                Upload Logo
                <input
                  type="file"
                  name="logo"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                  disabled={!canEdit}
                />
              </label>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
            </div>
          )}
        </div>
        {logoPreview && (
          <input type="hidden" name="logoUrl" value={logoPreview} />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Farm Name *
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
          <input
            type="text"
            name="farmName"
            required
            defaultValue={profile?.farmName || ""}
            placeholder="Enter farm name"
            className="form-input pl-10"
            disabled={!canEdit}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Farm Address *
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-4 h-4 text-green-400" />
          <textarea
            name="farmAddress"
            required
            defaultValue={profile?.farmAddress || ""}
            placeholder="Enter complete farm address"
            rows={3}
            className="form-input pl-10 resize-none"
            disabled={!canEdit}
          />
        </div>
      </div>

      {canEdit && (
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Profile
        </button>
      )}
    </form>
  );
}
