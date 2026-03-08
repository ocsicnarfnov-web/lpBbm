"use client";

import { useState } from "react";
import { addFlock, editFlock, deactivateFlock, addFlockTransfer } from "./actions";
import { Plus, Edit, ArrowRightLeft, X, Bird } from "lucide-react";

interface FlockWithStats {
  id: number;
  houseNumber: string;
  breed: string;
  loadingDate: Date;
  beginningMale: number;
  beginningFemale: number;
  isActive: boolean;
  notes: string | null;
  beginningPop: number;
  endingPop: number;
  totalMortality: number;
  livability: string;
  depletionRate: string;
  ageWeeks: number;
}

interface Transfer {
  id: number;
  fromFlockId: number | null;
  toFlockId: number | null;
  transferDate: Date;
  maleCount: number;
  femaleCount: number;
  reason: string | null;
}

interface FlockClientProps {
  flocks: FlockWithStats[];
  transfers: Transfer[];
  canEdit: boolean;
}

interface FlockFormProps {
  flock?: FlockWithStats;
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  loading: boolean;
  error: string;
}

function FlockForm({ flock, onSubmit, onCancel, loading, error }: FlockFormProps) {
  return (
    <form action={onSubmit} className="space-y-4">
      {flock && <input type="hidden" name="id" value={flock.id} />}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">House Number *</label>
          <input type="text" name="houseNumber" required defaultValue={flock?.houseNumber} className="form-input" placeholder="e.g. H1" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breed *</label>
          <input type="text" name="breed" required defaultValue={flock?.breed} className="form-input" placeholder="e.g. Ross 308" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Loading Date *</label>
        <input
          type="date"
          name="loadingDate"
          required
          defaultValue={flock ? new Date(flock.loadingDate).toISOString().split("T")[0] : ""}
          className="form-input"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beginning Male</label>
          <input type="number" name="beginningMale" min="0" defaultValue={flock?.beginningMale || 0} className="form-input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beginning Female</label>
          <input type="number" name="beginningFemale" min="0" defaultValue={flock?.beginningFemale || 0} className="form-input" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea name="notes" rows={2} defaultValue={flock?.notes || ""} className="form-input resize-none" placeholder="Optional notes..." />
      </div>
      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
          {flock ? "Save Changes" : "Add Flock"}
        </button>
      </div>
    </form>
  );
}

export default function FlockClient({ flocks, transfers, canEdit }: FlockClientProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedFlock, setSelectedFlock] = useState<FlockWithStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"flocks" | "transfers">("flocks");

  const activeFlocks = flocks.filter((f) => f.isActive);

  async function handleAdd(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await addFlock(formData) as { error?: string; success?: boolean };
    if (result?.error) setError(result.error);
    else setShowAddModal(false);
    setLoading(false);
  }

  async function handleEdit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await editFlock(formData) as { error?: string; success?: boolean };
    if (result?.error) setError(result.error);
    else setShowEditModal(false);
    setLoading(false);
  }

  async function handleTransfer(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await addFlockTransfer(formData) as { error?: string; success?: boolean };
    if (result?.error) setError(result.error);
    else setShowTransferModal(false);
    setLoading(false);
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("flocks")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === "flocks" ? "bg-green-600 text-white" : "bg-white text-gray-600 border border-green-200 hover:bg-green-50"}`}
        >
          <Bird className="w-4 h-4 inline mr-2" />
          Flocks ({activeFlocks.length})
        </button>
        <button
          onClick={() => setActiveTab("transfers")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === "transfers" ? "bg-green-600 text-white" : "bg-white text-gray-600 border border-green-200 hover:bg-green-50"}`}
        >
          <ArrowRightLeft className="w-4 h-4 inline mr-2" />
          Transfers ({transfers.length})
        </button>
        {canEdit && (
          <div className="ml-auto flex gap-2">
            <button onClick={() => setShowTransferModal(true)} className="btn-secondary flex items-center gap-2 text-sm">
              <ArrowRightLeft className="w-4 h-4" /> Transfer
            </button>
            <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Add Flock
            </button>
          </div>
        )}
      </div>

      {activeTab === "flocks" && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>House #</th>
                <th>Breed</th>
                <th>Loading Date</th>
                <th>Age (Weeks)</th>
                <th>Beginning Pop.</th>
                <th>Ending Pop.</th>
                <th>Livability %</th>
                <th>Depletion %</th>
                <th>Status</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {flocks.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 10 : 9} className="text-center py-8 text-gray-400">
                    <Bird className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No flocks added yet
                  </td>
                </tr>
              ) : (
                flocks.map((flock) => (
                  <tr key={flock.id}>
                    <td className="font-semibold text-green-700">House {flock.houseNumber}</td>
                    <td>{flock.breed}</td>
                    <td>{new Date(flock.loadingDate).toLocaleDateString()}</td>
                    <td>
                      <span className="badge badge-green">{flock.ageWeeks} wks</span>
                    </td>
                    <td>
                      <div className="text-xs">
                        <span className="text-blue-600">♂ {flock.beginningMale.toLocaleString()}</span>
                        {" / "}
                        <span className="text-pink-600">♀ {flock.beginningFemale.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-500">Total: {flock.beginningPop.toLocaleString()}</div>
                    </td>
                    <td className="font-medium">{flock.endingPop.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${parseFloat(flock.livability) >= 95 ? "badge-green" : parseFloat(flock.livability) >= 90 ? "badge-yellow" : "badge-red"}`}>
                        {flock.livability}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${parseFloat(flock.depletionRate) <= 5 ? "badge-green" : parseFloat(flock.depletionRate) <= 10 ? "badge-yellow" : "badge-red"}`}>
                        {flock.depletionRate}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${flock.isActive ? "badge-green" : "badge-red"}`}>
                        {flock.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    {canEdit && (
                      <td>
                        <button
                          onClick={() => { setSelectedFlock(flock); setShowEditModal(true); }}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "transfers" && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>From House</th>
                <th>To House</th>
                <th>Male</th>
                <th>Female</th>
                <th>Total</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {transfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    <ArrowRightLeft className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No transfers recorded
                  </td>
                </tr>
              ) : (
                transfers.map((t) => {
                  const fromFlock = flocks.find((f) => f.id === t.fromFlockId);
                  const toFlock = flocks.find((f) => f.id === t.toFlockId);
                  return (
                    <tr key={t.id}>
                      <td>{new Date(t.transferDate).toLocaleDateString()}</td>
                      <td>{fromFlock ? `House ${fromFlock.houseNumber}` : "—"}</td>
                      <td>{toFlock ? `House ${toFlock.houseNumber}` : "—"}</td>
                      <td className="text-blue-600">♂ {t.maleCount}</td>
                      <td className="text-pink-600">♀ {t.femaleCount}</td>
                      <td className="font-medium">{t.maleCount + t.femaleCount}</td>
                      <td className="text-gray-500">{t.reason || "—"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-green-100">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Bird className="w-5 h-5 text-green-600" /> Add New Flock
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <FlockForm
                onSubmit={handleAdd}
                onCancel={() => setShowAddModal(false)}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedFlock && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-green-100">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Edit className="w-5 h-5 text-green-600" /> Edit Flock - House {selectedFlock.houseNumber}
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <FlockForm
                flock={selectedFlock}
                onSubmit={handleEdit}
                onCancel={() => setShowEditModal(false)}
                loading={loading}
                error={error}
              />
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-green-100">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-green-600" /> Flock Transfer
              </h3>
              <button onClick={() => setShowTransferModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <form action={handleTransfer} className="space-y-4">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From House *</label>
                    <select name="fromFlockId" required className="form-input">
                      <option value="">Select house</option>
                      {activeFlocks.map((f) => (
                        <option key={f.id} value={f.id}>House {f.houseNumber}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To House *</label>
                    <select name="toFlockId" required className="form-input">
                      <option value="">Select house</option>
                      {activeFlocks.map((f) => (
                        <option key={f.id} value={f.id}>House {f.houseNumber}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Date *</label>
                  <input type="date" name="transferDate" required className="form-input" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Male Count</label>
                    <input type="number" name="maleCount" min="0" defaultValue="0" className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Female Count</label>
                    <input type="number" name="femaleCount" min="0" defaultValue="0" className="form-input" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <input type="text" name="reason" className="form-input" placeholder="Reason for transfer" />
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowTransferModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
                    Record Transfer
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
