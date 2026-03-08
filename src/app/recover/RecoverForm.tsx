"use client";

import { useState } from "react";
import { recoverAccountAction } from "./actions";
import Link from "next/link";

export default function RecoverForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    
    const result = await recoverAccountAction(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Account Reactivated!</h2>
        <p className="text-gray-500 mt-2">You can now log in with your credentials.</p>
        <Link href="/login" className="btn btn-primary mt-6 inline-block">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="form-label">Email Address</label>
        <input
          type="email"
          name="email"
          required
          className="form-input"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="form-label">Recovery Code</label>
        <input
          type="password"
          name="recoveryCode"
          required
          className="form-input"
          placeholder="Enter recovery code"
        />
        <p className="text-xs text-gray-500 mt-1">Contact admin for recovery code</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
        ) : (
          "Reactivate Account"
        )}
      </button>
    </form>
  );
}
