"use client";

import { useState } from "react";
import Link from "next/link";

interface SignInFormProps {
  redirectTo?: string;
  microfrontend?: "user" | "admin";
}

export default function SignInForm({ redirectTo = "/dashboard", microfrontend = "user" }: SignInFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          microfrontend,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to the appropriate dashboard
        window.location.href = redirectTo;
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Sign in failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            FlexiPix
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900 mt-4">
            {microfrontend === "admin" ? "Admin Sign In" : "Sign In"}
          </h1>
          <p className="text-gray-600 mt-2">
            {microfrontend === "admin" 
              ? "Access your admin dashboard" 
              : "Access your account"
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => updateFormData("password", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p><strong>Admin:</strong> admin@flexipix.com / admin123</p>
            <p><strong>Client:</strong> client@flexipix.com / client123</p>
            <p><strong>Viewer:</strong> viewer@flexipix.com / viewer123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
