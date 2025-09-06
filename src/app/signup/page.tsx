"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "../../hooks/useAuth";
import AuthGuard from "../../components/AuthGuard";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const router = useRouter();
  const registerMutation = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      await registerMutation.mutateAsync({ name, email, password });
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <AuthGuard requireAuth={false} redirectTo="/notes">
      <div
        className="font-sans flex items-center justify-center min-h-screen"
        style={{ color: "#000" }}
      >
        <div
          className="w-full max-w-xl p-8 shadow-lg rounded-xl text-center"
          style={{ background: "#ffffff" }}
        >
          <div className="mb-4">
            <Image
              src="/sarana_ai_logo.jpeg"
              alt="Sarana Notes Logo"
              width={100}
              height={100}
              className="mx-auto mb-4 rounded-2xl pb-2"
            />
            <div>
              <h1 className="text-2xl font-bold">Sign Up for Sarana Notes</h1>
              <h2 className="text-lg">Create your personal account</h2>
            </div>
            <p className="text-md p-5">Create an account to continue</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-start w-full">
                <label htmlFor="name" className="mb-1 font-semibold text-sm">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="flex flex-col items-start w-full">
                <label htmlFor="email" className="mb-1 font-semibold text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="flex flex-col items-start w-full">
                <label
                  htmlFor="password"
                  className="mb-1 font-semibold text-sm"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="flex flex-col items-start w-full">
                <label
                  htmlFor="confirmPassword"
                  className="mb-1 font-semibold text-sm"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="mt-4 w-full px-5 py-2 bg-black text-white rounded-full hover:bg-white hover:text-black hover:border-black transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registerMutation.isPending ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-4 text-center pt-3">
              <span>Already have an account? </span>
              <a
                href="/login"
                className="font-bold underline text-blue-600 hover:text-blue-800 transition"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
