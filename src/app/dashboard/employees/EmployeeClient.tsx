"use client";

import { useState } from "react";
import { addEmployee, editEmployee } from "./actions";
import { Plus, Edit, X, Users, Upload } from "lucide-react";

interface Employee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  birthday: Date | null;
  address: string | null;
  contactNumber: string | null;
  email: string | null;
  dateHired: Date;
  position: string;
  resignationDate: Date | null;
  status: "active" | "resigned" | "terminated";
  pictureUrl: string | null;
}

interface EmployeeClientProps {
  employees: Employee[];
  canEdit: boolean;
}

interface EmployeeFormProps {
  emp?: Employee;
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  loading: boolean;
  error: string;
  picturePreview: string;
  onPictureChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function EmployeeForm({ emp, onSubmit, onCancel, loading, error, picturePreview, onPictureChange }: EmployeeFormProps) {
  return (
    <form action={onSubmit} className="space-y-4">
      {emp && <input type="hidden" name="id" value={emp.id} />}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">{error}</div>}

      {/* Picture Upload */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full border-2 border-dashed border-green-300 flex items-center justify-center overflow-hidden bg-green-50 flex-shrink-0">
          {(picturePreview || emp?.pictureUrl) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={picturePreview || emp?.pictureUrl || ""} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <Users className="w-8 h-8 text-green-300" />
          )}
        </div>
        <label className="btn-secondary cursor-pointer flex items-center gap-2 text-sm">
          <Upload className="w-4 h-4" /> Upload Photo
          <input type="file" accept="image/*" className="hidden" onChange={onPictureChange} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input type="text" name="firstName" required defaultValue={emp?.firstName} className="form-input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input type="text" name="lastName" required defaultValue={emp?.lastName} className="form-input" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
          <input type="date" name="birthday" defaultValue={emp?.birthday ? new Date(emp.birthday).toISOString().split("T")[0] : ""} className="form-input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
          <input type="tel" name="contactNumber" defaultValue={emp?.contactNumber || ""} className="form-input" placeholder="+63..." />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" name="email" defaultValue={emp?.email || ""} className="form-input" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea name="address" rows={2} defaultValue={emp?.address || ""} className="form-input resize-none" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Hired *</label>
          <input type="date" name="dateHired" required defaultValue={emp?.dateHired ? new Date(emp.dateHired).toISOString().split("T")[0] : ""} className="form-input" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
          <input type="text" name="position" required defaultValue={emp?.position} className="form-input" placeholder="e.g. Farm Worker" />
        </div>
      </div>

      {emp && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" defaultValue={emp.status} className="form-input">
              <option value="active">Active</option>
              <option value="resigned">Resigned</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resignation/Termination Date</label>
            <input type="date" name="resignationDate" defaultValue={emp.resignationDate ? new Date(emp.resignationDate).toISOString().split("T")[0] : ""} className="form-input" />
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
          {emp ? "Save Changes" : "Add Employee"}
        </button>
      </div>
    </form>
  );
}

function calculateTenure(dateHired: Date, endDate?: Date | null): string {
  const end = endDate ? new Date(endDate) : new Date();
  const start = new Date(dateHired);
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  const totalMonths = years * 12 + months;
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  if (y === 0) return `${m} month${m !== 1 ? "s" : ""}`;
  if (m === 0) return `${y} year${y !== 1 ? "s" : ""}`;
  return `${y}y ${m}m`;
}

export default function EmployeeClient({ employees, canEdit }: EmployeeClientProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [picturePreview, setPicturePreview] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "resigned" | "terminated">("all");

  const filteredEmployees = filterStatus === "all" ? employees : employees.filter((e) => e.status === filterStatus);

  async function handleAdd(formData: FormData) {
    setLoading(true);
    setError("");
    if (picturePreview) formData.set("pictureUrl", picturePreview);
    const result = await addEmployee(formData) as { error?: string; success?: boolean };
    if (result?.error) setError(result.error);
    else { setShowAddModal(false); setPicturePreview(""); }
    setLoading(false);
  }

  async function handleEdit(formData: FormData) {
    setLoading(true);
    setError("");
    if (picturePreview) formData.set("pictureUrl", picturePreview);
    const result = await editEmployee(formData) as { error?: string; success?: boolean };
    if (result?.error) setError(result.error);
    else { setShowEditModal(false); setPicturePreview(""); }
    setLoading(false);
  }

  function handlePictureChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPicturePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", count: employees.length, color: "bg-blue-500" },
          { label: "Active", count: employees.filter((e) => e.status === "active").length, color: "bg-green-500" },
          { label: "Resigned", count: employees.filter((e) => e.status === "resigned").length, color: "bg-yellow-500" },
          { label: "Terminated", count: employees.filter((e) => e.status === "terminated").length, color: "bg-red-500" },
        ].map((stat) => (
          <div key={stat.label} className="card flex items-center gap-3">
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{stat.count}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Actions */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {["all", "active", "resigned", "terminated"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as typeof filterStatus)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${filterStatus === status ? "bg-green-600 text-white" : "bg-white text-gray-600 border border-green-200 hover:bg-green-50"}`}
          >
            {status}
          </button>
        ))}
        {canEdit && (
          <button onClick={() => { setShowAddModal(true); setPicturePreview(""); }} className="btn-primary flex items-center gap-2 text-sm ml-auto">
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>ID</th>
              <th>Position</th>
              <th>Contact</th>
              <th>Date Hired</th>
              <th>Tenure</th>
              <th>Status</th>
              {canEdit && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan={canEdit ? 8 : 7} className="text-center py-8 text-gray-400">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No employees found
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-green-100 flex-shrink-0">
                        {emp.pictureUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={emp.pictureUrl} alt={emp.firstName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-green-600 font-bold text-sm">
                            {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-gray-400">{emp.email || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-blue text-xs">{emp.employeeId}</span>
                  </td>
                  <td className="font-medium">{emp.position}</td>
                  <td className="text-gray-500 text-sm">{emp.contactNumber || "—"}</td>
                  <td>{new Date(emp.dateHired).toLocaleDateString()}</td>
                  <td>
                    <span className="badge badge-green">
                      {calculateTenure(emp.dateHired, emp.resignationDate)}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${emp.status === "active" ? "badge-green" : emp.status === "resigned" ? "badge-yellow" : "badge-red"}`}>
                      {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                    </span>
                  </td>
                  {canEdit && (
                    <td>
                      <button
                        onClick={() => { setSelectedEmployee(emp); setPicturePreview(""); setShowEditModal(true); }}
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-green-100 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" /> Add New Employee
              </h3>
              <button onClick={() => { setShowAddModal(false); setPicturePreview(""); }}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6">
              <EmployeeForm
                onSubmit={handleAdd}
                onCancel={() => { setShowAddModal(false); setPicturePreview(""); }}
                loading={loading}
                error={error}
                picturePreview={picturePreview}
                onPictureChange={handlePictureChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-green-100 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-500" /> Edit Employee
              </h3>
              <button onClick={() => { setShowEditModal(false); setPicturePreview(""); }}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-6">
              <EmployeeForm
                emp={selectedEmployee}
                onSubmit={handleEdit}
                onCancel={() => { setShowEditModal(false); setPicturePreview(""); }}
                loading={loading}
                error={error}
                picturePreview={picturePreview}
                onPictureChange={handlePictureChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
