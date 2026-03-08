import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg mb-4">
            <span className="text-4xl">🐔</span>
          </div>
          <h1 className="text-3xl font-bold text-green-800">BreederPro</h1>
          <p className="text-green-600 mt-1">Broiler Breeder Management System</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Create Account</h2>
          <p className="text-sm text-gray-500 mb-6">
            Register to access the management system. The first registered user becomes admin.
          </p>
          <RegisterForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="text-green-600 font-semibold hover:text-green-700">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
