"use client";

import { useState } from "react";
import { addMortality } from "./actions";
import { Plus, X, Skull, AlertTriangle } from "lucide-react";

interface MortalityRecord {
  id: number;
  flockId: number | null;
  recordDate: Date;
  mortalityMale: number;
  mortalityFemale: number;
  spotCullMale: number;
  spotCullFemale: number;
  spentCullMale: number;
  spentCullFemale: number;
  missexMale: number;
  missexFemale: number;
  reportedBy: number | null;
  notes: string | null;
}

interface MortalityClientProps {
  records: MortalityRecord[];
  flocks: { id: number; houseNumber: string }[];
  users: { id: number; name: string }[];
  canEdit: boolean;
  currentUserId: number | undefined;
}

export default function MortalityClient({ records, flocks, users, canEdit, currentUserId }: MortalityClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await addMortality(formData);
    if (result?.error) setError(result.error);
    else setShowModal(false);
    setLoading(false);
  }

  const totalMortality = records.reduce(
    (sum, r) => sum + r.mortalityMale + r.mortalityFemale,
    0
  );
  const totalCulls = records.reduce(
    (sum, r) => sum + r.spotCullMale + r.spotCullFemale + r.spentCullMale + r.spentCullFemale,
    0
  );
  const totalMissex = records.reduce(
    (sum, r) => sum + r.missexMale + r.missexFemale,
    0
  );

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
            <Skull className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{totalMortality.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Mortality</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{totalCulls.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Culls</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">MX</span>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{totalMissex.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Missex</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Mortality Records</h2>
        {canEdit && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Record Mortality
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>House</th>
              <th>Mortality ♂/♀</th>
              <th>Spot Cull ♂/♀</th>
              <th>Spent Cull ♂/♀</th>
              <th>Missex ♂/♀</th>
              <th>Total</th>
              <th>Reported By</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400">
                  <Skull className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No mortality records
                </td>
              </tr>
            ) : (
              records.map((record) => {
                const flock = flocks.find((f) => f.id === record.flockId);
                const reporter = users.find((u) => u.id === record.reportedBy);
                const total =
                  record.mortalityMale + record.mortalityFemale +
                  record.spotCullMale + record.spotCullFemale +
                  record.spentCullMale + record.spentCullFemale +
                  record.missexMale + record.missexFemale;

                return (
                  <tr key={record.id}>
                    <td>{new Date(record.recordDate).toLocaleDateString()}</td>
                    <td className="font-medium text-green-700">
                      {flock ? `House ${flock.houseNumber}` : "—"}
                    </td>
                    <td>
                      <span className="text-blue-600">♂{record.mortalityMale}</span>
                      {" / "}
                      <span className="text-pink-600">♀{record.mortalityFemale}</span>
                    </td>
                    <td>
                      <span className="text-blue-600">♂{record.spotCullMale}</span>
                      {" / "}
                      <span className="text-pink-600">♀{record.spotCullFemale}</span>
                    </td>
                    <td>
                      <span className="text-blue-600">♂{record.spentCullMale}</span>
                      {" / "}
                      <span className="text-pink-600">♀{record.spentCullFemale}</span>
                    </td>
                    <td>
                      <span className="text-blue-600">♂{record.missexMale}</span>
                      {" / "}
                      <span className="text-pink-600">♀{record.missexFemale}</span>
                    </td>
                    <td>
                      <span className={`badge ${total === 0 ? "badge-green" : total <= 5 ? "badge-yellow" : "badge-red"}`}>
                        {total}
                      </span>
                    </td>
                    <td className="text-gray-500 text-sm">{reporter?.name || "—"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-green-100 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Skull className="w-5 h-5 text-red-500" /> Record Mortality
              </h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6">
              <form action={handleSubmit} className="space-y-5">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">House/Flock *</label>
                    <select name="flockId" required className="form-input">
                      <option value="">Select house</option>
                      {flocks.map((f) => <option key={f.id} value={f.id}>House {f.houseNumber}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input type="date" name="recordDate" required className="form-input" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                </div>

                {/* Mortality */}
                <div className="bg-red-50 rounded-xl p-4">
                  <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <Skull className="w-4 h-4" /> Mortality
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Male ♂</label>
                      <input type="number" name="mortalityMale" min="0" defaultValue="0" className="form-input" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Female ♀</label>
                      <input type="number" name="mortalityFemale" min="0" defaultValue="0" className="form-input" />
                    </div>
                  </div>
                </div>

                {/* Spot Cull */}
                <div className="bg-orange-50 rounded-xl p-4">
                  <h4 className="font-semibold text-orange-700 mb-3">Spot Cull</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Male ♂</label>
                      <input type="number" name="spotCullMale" min="0" defaultValue="0" className="form-input" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Female ♀</label>
                      <input type="number" name="spotCullFemale" min="0" defaultValue="0" className="form-input" />
                    </div>
                  </div>
                </div>

                {/* Spent Cull */}
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-yellow-700 mb-3">Spent Cull</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Male ♂</label>
                      <input type="number" name="spentCullMale" min="0" defaultValue="0" className="form-input" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Female ♀</label>
                      <input type="number" name="spentCullFemale" min="0" defaultValue="0" className="form-input" />
                    </div>
                  </div>
                </div>

                {/* Missex */}
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-700 mb-3">Missex</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Male ♂</label>
                      <input type="number" name="missexMale" min="0" defaultValue="0" className="form-input" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Female ♀</label>
                      <input type="number" name="missexFemale" min="0" defaultValue="0" className="form-input" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea name="notes" rows={2} className="form-input resize-none" placeholder="Optional notes..." />
                </div>

                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
                    Save Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
