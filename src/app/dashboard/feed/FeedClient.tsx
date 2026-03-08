"use client";

import { useState } from "react";
import { addFeedCategory, editFeedCategory, addFeedIncoming, addFeedConsumption, setBeginningInventory } from "./actions";
import { Plus, Edit, Package, TrendingDown, Wheat, X, Archive } from "lucide-react";

interface CategoryWithInventory {
  id: number;
  name: string;
  description: string | null;
  beginningInventoryKg: number;
  currentStockKg: number;
  totalIncomingKg: number;
  totalConsumedKg: number;
  endingInventoryKg: number;
}

interface FeedClientProps {
  categories: CategoryWithInventory[];
  incoming: { id: number; categoryId: number | null; quantityBags: number; quantityKg: number; deliveryDate: Date; supplier: string | null }[];
  consumption: { id: number; flockId: number | null; categoryId: number | null; consumptionDate: Date; quantityKg: number }[];
  flocks: { id: number; houseNumber: string }[];
  canEdit: boolean;
}

export default function FeedClient({ categories, incoming, consumption, flocks, canEdit }: FeedClientProps) {
  const [activeTab, setActiveTab] = useState<"inventory" | "incoming" | "consumption">("inventory");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showIncomingModal, setShowIncomingModal] = useState(false);
  const [showConsumptionModal, setShowConsumptionModal] = useState(false);
  const [showBeginningModal, setShowBeginningModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithInventory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bagInput, setBagInput] = useState("");

  const totalStock = categories.reduce((sum, c) => sum + c.currentStockKg, 0);

  async function handleAddCategory(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await addFeedCategory(formData) as { error?: string; success?: boolean };
    if (result?.error) setError(result.error);
    else setShowCategoryModal(false);
    setLoading(false);
  }

  async function handleEditCategory(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await editFeedCategory(formData) as { error?: string; success?: boolean };
    if (result?.error) setError(result.error);
    else setShowEditCategoryModal(false);
    setLoading(false);
  }

  async function handleIncoming(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await addFeedIncoming(formData) as { error?: string; success?: boolean };
    if (result?.error) setError(result.error);
    else { setShowIncomingModal(false); setBagInput(""); }
    setLoading(false);
  }

  async function handleConsumption(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await addFeedConsumption(formData) as { error?: string; success?: boolean };
    if (result?.error) setError(result.error);
    else setShowConsumptionModal(false);
    setLoading(false);
  }

  async function handleBeginning(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await setBeginningInventory(formData) as { error?: string; success?: boolean };
    if (result?.error) setError(result.error);
    else setShowBeginningModal(false);
    setLoading(false);
  }

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
            <Archive className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{totalStock.toLocaleString()} kg</p>
            <p className="text-sm text-gray-500">Total Current Stock</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">{categories.length}</p>
            <p className="text-sm text-gray-500">Feed Categories</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-800">
              {consumption.reduce((sum, c) => sum + c.quantityKg, 0).toLocaleString()} kg
            </p>
            <p className="text-sm text-gray-500">Total Consumed</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["inventory", "incoming", "consumption"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all capitalize ${activeTab === tab ? "bg-green-600 text-white" : "bg-white text-gray-600 border border-green-200 hover:bg-green-50"}`}
          >
            {tab === "inventory" ? "📦 Inventory" : tab === "incoming" ? "📥 Incoming" : "📤 Consumption"}
          </button>
        ))}
        {canEdit && (
          <div className="ml-auto flex gap-2">
            {activeTab === "inventory" && (
              <>
                <button onClick={() => setShowBeginningModal(true)} className="btn-secondary text-sm flex items-center gap-1">
                  <Archive className="w-4 h-4" /> Set Beginning
                </button>
                <button onClick={() => setShowCategoryModal(true)} className="btn-primary text-sm flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </>
            )}
            {activeTab === "incoming" && (
              <button onClick={() => setShowIncomingModal(true)} className="btn-primary text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Delivery
              </button>
            )}
            {activeTab === "consumption" && (
              <button onClick={() => setShowConsumptionModal(true)} className="btn-primary text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" /> Log Consumption
              </button>
            )}
          </div>
        )}
      </div>

      {/* Inventory Tab */}
      {activeTab === "inventory" && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Feed Type</th>
                <th>Description</th>
                <th>Beginning (kg)</th>
                <th>Total Incoming (kg)</th>
                <th>Total Consumed (kg)</th>
                <th>Current Stock (kg)</th>
                <th>Ending Inventory (kg)</th>
                {canEdit && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={canEdit ? 8 : 7} className="text-center py-8 text-gray-400">
                    <Wheat className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No feed categories added yet
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td className="font-semibold text-green-700">{cat.name}</td>
                    <td className="text-gray-500">{cat.description || "—"}</td>
                    <td>{cat.beginningInventoryKg.toLocaleString()}</td>
                    <td className="text-blue-600">+{cat.totalIncomingKg.toLocaleString()}</td>
                    <td className="text-red-600">-{cat.totalConsumedKg.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${cat.currentStockKg > 1000 ? "badge-green" : cat.currentStockKg > 500 ? "badge-yellow" : "badge-red"}`}>
                        {cat.currentStockKg.toLocaleString()} kg
                      </span>
                    </td>
                    <td className="font-medium">{cat.endingInventoryKg.toLocaleString()} kg</td>
                    {canEdit && (
                      <td>
                        <button
                          onClick={() => { setSelectedCategory(cat); setShowEditCategoryModal(true); }}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
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

      {/* Incoming Tab */}
      {activeTab === "incoming" && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Feed Type</th>
                <th>Bags</th>
                <th>Quantity (kg)</th>
                <th>Supplier</th>
              </tr>
            </thead>
            <tbody>
              {incoming.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">No incoming deliveries recorded</td>
                </tr>
              ) : (
                incoming.map((item) => {
                  const cat = categories.find((c) => c.id === item.categoryId);
                  return (
                    <tr key={item.id}>
                      <td>{new Date(item.deliveryDate).toLocaleDateString()}</td>
                      <td className="font-medium">{cat?.name || "—"}</td>
                      <td>{item.quantityBags} bags</td>
                      <td className="text-blue-600 font-medium">{item.quantityKg.toLocaleString()} kg</td>
                      <td className="text-gray-500">{item.supplier || "—"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Consumption Tab */}
      {activeTab === "consumption" && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>House/Flock</th>
                <th>Feed Type</th>
                <th>Quantity (kg)</th>
              </tr>
            </thead>
            <tbody>
              {consumption.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">No consumption records</td>
                </tr>
              ) : (
                consumption.map((item) => {
                  const cat = categories.find((c) => c.id === item.categoryId);
                  const flock = flocks.find((f) => f.id === item.flockId);
                  return (
                    <tr key={item.id}>
                      <td>{new Date(item.consumptionDate).toLocaleDateString()}</td>
                      <td className="font-medium">{flock ? `House ${flock.houseNumber}` : "—"}</td>
                      <td>{cat?.name || "—"}</td>
                      <td className="text-red-600 font-medium">{item.quantityKg.toLocaleString()} kg</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-green-100">
              <h3 className="text-lg font-semibold text-gray-800">Add Feed Category</h3>
              <button onClick={() => setShowCategoryModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6">
              <form action={handleAddCategory} className="space-y-4">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feed Type Name *</label>
                  <input type="text" name="name" required className="form-input" placeholder="e.g. Starter Feed, Grower Feed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" rows={2} className="form-input resize-none" placeholder="Optional description" />
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowCategoryModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary">Add Category</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditCategoryModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-green-100">
              <h3 className="text-lg font-semibold text-gray-800">Edit Feed Category</h3>
              <button onClick={() => setShowEditCategoryModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6">
              <form action={handleEditCategory} className="space-y-4">
                <input type="hidden" name="id" value={selectedCategory.id} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feed Type Name *</label>
                  <input type="text" name="name" required defaultValue={selectedCategory.name} className="form-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" rows={2} defaultValue={selectedCategory.description || ""} className="form-input resize-none" />
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowEditCategoryModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Set Beginning Inventory Modal */}
      {showBeginningModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-green-100">
              <h3 className="text-lg font-semibold text-gray-800">Set Beginning Inventory</h3>
              <button onClick={() => setShowBeginningModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6">
              <form action={handleBeginning} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feed Category *</label>
                  <select name="categoryId" required className="form-input">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Beginning Inventory (kg) *</label>
                  <input type="number" name="beginningKg" min="0" step="0.01" required className="form-input" placeholder="0.00" />
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowBeginningModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary">Set Inventory</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Incoming Modal */}
      {showIncomingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-green-100">
              <h3 className="text-lg font-semibold text-gray-800">Add Feed Delivery</h3>
              <button onClick={() => setShowIncomingModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6">
              <form action={handleIncoming} className="space-y-4">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feed Type *</label>
                  <select name="categoryId" required className="form-input">
                    <option value="">Select feed type</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date *</label>
                  <input type="date" name="deliveryDate" required className="form-input" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity (Bags) * <span className="text-gray-400 font-normal">— 1 bag = 50 kg</span>
                  </label>
                  <input
                    type="number"
                    name="quantityBags"
                    min="0"
                    step="0.5"
                    required
                    className="form-input"
                    placeholder="Number of bags"
                    value={bagInput}
                    onChange={(e) => setBagInput(e.target.value)}
                  />
                  {bagInput && (
                    <p className="text-sm text-green-600 mt-1">
                      = {(parseFloat(bagInput) * 50).toLocaleString()} kg
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                  <input type="text" name="supplier" className="form-input" placeholder="Supplier name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input type="text" name="notes" className="form-input" placeholder="Optional notes" />
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowIncomingModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary">Add Delivery</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Consumption Modal */}
      {showConsumptionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-green-100">
              <h3 className="text-lg font-semibold text-gray-800">Log Daily Consumption</h3>
              <button onClick={() => setShowConsumptionModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6">
              <form action={handleConsumption} className="space-y-4">
                {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">House/Flock *</label>
                  <select name="flockId" required className="form-input">
                    <option value="">Select house</option>
                    {flocks.map((f) => <option key={f.id} value={f.id}>House {f.houseNumber}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feed Type *</label>
                  <select name="categoryId" required className="form-input">
                    <option value="">Select feed type</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.currentStockKg.toLocaleString()} kg available)</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" name="consumptionDate" required className="form-input" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (kg) *</label>
                  <input type="number" name="quantityKg" min="0" step="0.01" required className="form-input" placeholder="Daily consumption in kg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <input type="text" name="notes" className="form-input" placeholder="Optional notes" />
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowConsumptionModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={loading} className="btn-primary">Log Consumption</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
