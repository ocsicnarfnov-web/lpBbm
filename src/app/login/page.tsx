import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
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

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Welcome Back</h2>
          <LoginForm />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-green-600 font-semibold hover:text-green-700">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
