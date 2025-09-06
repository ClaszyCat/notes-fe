"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "../../hooks/useAuth";
import AuthGuard from "../../components/AuthGuard";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await loginMutation.mutateAsync({ email, password });
      router.push("/notes");
    } catch (err: any) {
      setError(err.message || "Login failed");
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
          <div className="mb-5">
            <Image
              src="/sarana_ai_logo.jpeg"
              alt="Sarana Notes Logo"
              width={100}
              height={100}
              className="mx-auto mb-4 rounded-2xl pb-2"
            />
            <div>
              <h1 className="text-2xl font-bold">Welcome to Sarana Notes</h1>
              <h2 className="text-lg">Your personal note-taking app</h2>
            </div>
            <p className="text-md p-5">Sign In to Continue</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-start w-full">
                <label htmlFor="email" className="mb-1 font-semibold text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your password"
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
                disabled={loginMutation.isPending}
                className="mt-4 w-full px-5 py-2 bg-black text-white rounded-full hover:bg-white hover:text-black hover:border-black transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="mt-4 pt-3">
              <span>Don't have an account? </span>
              <a
                href="/signup"
                className="font-bold underline text-blue-600 hover:text-blue-800 transition p-2"
              >
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
