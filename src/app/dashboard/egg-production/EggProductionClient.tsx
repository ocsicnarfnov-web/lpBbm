"use client";

import { useState } from "react";
import { addEggProduction } from "./actions";
import { Plus, X, Egg, Download } from "lucide-react";
import * as XLSX from "xlsx";

interface EggRecord {
  id: number;
  flockId: number | null;
  recordDate: Date;
  hatchingEggs: number;
  smallEggs: number;
  thinShellEggs: number;
  misshapeEggs: number;
  doubleYolkEggs: number;
  brokenEggs: number;
  spoiledEggs: number;
  othersEggs: number;
  reportedBy: number | null;
  notes: string | null;
}

interface EggProductionClientProps {
  records: EggRecord[];
  flocks: { id: number; houseNumber: string }[];
  users: { id: number; name: string }[];
  canEdit: boolean;
}

export default function EggProductionClient({ records, flocks, users, canEdit }: EggProductionClientProps) {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await addEggProduction(formData);
    if (result?.error) setError(result.error);
    else setShowModal(false);
    setLoading(false);
  }

  function exportToExcel() {
    const data = records.map((r) => {
      const flock = flocks.find((f) => f.id === r.flockId);
      const reporter = users.find((u) => u.id === r.reportedBy);
      const nonHatching = r.smallEggs + r.thinShellEggs + r.misshapeEggs + r.doubleYolkEggs + r.brokenEggs + r.spoiledEggs + r.othersEggs;
      const total = r.hatchingEggs + nonHatching;
      return {
        Date: new Date(r.recordDate).toLocaleDateString(),
        "House No.": flock ? `House ${flock.houseNumber}` : "—",
        "Hatching Eggs": r.hatchingEggs,
        "Small": r.smallEggs,
        "Thin Shell": r.thinShellEggs,
        "Misshape": r.misshapeEggs,
        "Double Yolk": r.doubleYolkEggs,
        "Broken": r.brokenEggs,
        "Spoiled": r.spoiledEggs,
        "Others": r.othersEggs,
        "Total Non-Hatching": nonHatching,
        "Total Egg Production": total,
        "Reported By": reporter?.name || "—",
        "Notes": r.notes || "",
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Egg Production");
    XLSX.writeFile(wb, `egg-production-${new Date().toISOString().split("T")[0]}.xlsx`);
  }

  const totalHatching = records.reduce((sum, r) => sum + r.hatchingEggs, 0);
  const totalNonHatching = records.reduce(
    (sum, r) => sum + r.smallEggs + r.thinShellEggs + r.misshapeEggs + r.doubleYolkEggs + r.brokenEggs + r.spoiledEggs + r.othersEggs,
    0
  );
  const totalEggs = totalHatching + totalNonHatching;

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
            <Egg className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{totalEggs.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Eggs</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">🥚</span>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{totalHatching.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Hatching Eggs</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-red-400 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">❌</span>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{totalNonHatching.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Non-Hatching Eggs</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Production Records</h2>
        <div className="flex gap-2">
          {records.length > 0 && (
            <button onClick={exportToExcel} className="btn-secondary flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" /> Export Excel
            </button>
          )}
          {canEdit && (
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Log Production
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>House</th>
              <th>Hatching</th>
              <th>Small</th>
              <th>Thin Shell</th>
              <th>Misshape</th>
              <th>Dbl Yolk</th>
              <th>Broken</th>
              <th>Spoiled</th>
              <th>Others</th>
              <th>Non-Hatching</th>
              <th>Total</th>
              <th>Reported By</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center py-8 text-gray-400">
                  <Egg className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No egg production records
                </td>
              </tr>
            ) : (
              records.map((record) => {
                const flock = flocks.find((f) => f.id === record.flockId);
                const reporter = users.find((u) => u.id === record.reportedBy);
                const nonHatching = record.smallEggs + record.thinShellEggs + record.misshapeEggs + record.doubleYolkEggs + record.brokenEggs + record.spoiledEggs + record.othersEggs;
                const total = record.hatchingEggs + nonHatching;

                return (
                  <tr key={record.id}>
                    <td>{new Date(record.recordDate).toLocaleDateString()}</td>
                    <td className="font-medium text-green-700">
                      {flock ? `House ${flock.houseNumber}` : "—"}
                    </td>
                    <td className="text-green-600 font-medium">{record.hatchingEggs.toLocaleString()}</td>
                    <td>{record.smallEggs}</td>
                    <td>{record.thinShellEggs}</td>
                    <td>{record.misshapeEggs}</td>
                    <td>{record.doubleYolkEggs}</td>
                    <td>{record.brokenEggs}</td>
                    <td>{record.spoiledEggs}</td>
                    <td>{record.othersEggs}</td>
                    <td className="text-red-500">{nonHatching.toLocaleString()}</td>
                    <td>
                      <span className="badge badge-green font-bold">{total.toLocaleString()}</span>
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
                <Egg className="w-5 h-5 text-yellow-500" /> Log Egg Production
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

                {/* Hatching Eggs */}
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-semibold text-green-700 mb-3">🥚 Hatching Eggs</h4>
                  <input type="number" name="hatchingEggs" min="0" defaultValue="0" className="form-input" placeholder="Number of hatching eggs" />
                </div>

                {/* Non-Hatching Eggs */}
                <div className="bg-red-50 rounded-xl p-4">
                  <h4 className="font-semibold text-red-700 mb-3">❌ Non-Hatching Eggs</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "smallEggs", label: "Small" },
                      { name: "thinShellEggs", label: "Thin Shell" },
                      { name: "misshapeEggs", label: "Misshape" },
                      { name: "doubleYolkEggs", label: "Double Yolk" },
                      { name: "brokenEggs", label: "Broken" },
                      { name: "spoiledEggs", label: "Spoiled" },
                      { name: "othersEggs", label: "Others" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
                        <input type="number" name={field.name} min="0" defaultValue="0" className="form-input" />
                      </div>
                    ))}
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
