import RecoverForm from "./RecoverForm";

export default function RecoverPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Account Recovery</h1>
          <p className="text-gray-500 mt-2">Reactivate your deactivated account</p>
        </div>

        <RecoverForm />

        <div className="mt-6 text-center">
          <a href="/login" className="text-sm text-green-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
