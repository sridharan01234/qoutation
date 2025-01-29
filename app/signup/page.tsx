"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      setError("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      router.push("/login");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-primary-100">
        <div className="grid md:grid-cols-5 gap-6">
          {/* Left Section with Background */}
          <div className="md:col-span-2 bg-gradient-to-br from-primary-500 to-secondary-500 p-6 rounded-l-xl hidden md:flex md:flex-col md:justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold font-playfair mb-4">
                Welcome Back!
              </h2>
              <p className="text-sm font-inter text-white/90">
                Join our community and experience the best service.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-inter">Easy Registration</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-inter">Secure Platform</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-inter">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="md:col-span-3 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-primary-800 font-playfair">
                Sign Up
              </h2>
              <p className="text-sm text-primary-600 font-inter mt-1">
                Create an account to get started
              </p>
            </div>

            {/* Google Sign In Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-white px-4 py-2.5 
                         text-primary-700 rounded-lg border border-primary-200 
                         hover:bg-primary-50 hover:border-primary-300 
                         transition-all duration-200 ease-in-out 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-primary-500 font-inter shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  {/* ... Google SVG paths remain the same ... */}
                </svg>
                <span className="font-medium">Continue with Google</span>
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-primary-500 font-inter">
                  or
                </span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div
                  className="bg-primary-50 text-primary-600 text-sm p-3 
                             rounded-lg flex items-center gap-2 border border-primary-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-primary-700 mb-1 font-inter"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 
                             border border-primary-200 placeholder-primary-400 
                             text-primary-900 focus:outline-none focus:ring-2 
                             focus:ring-primary-500 focus:border-primary-500 
                             text-sm font-inter transition-colors duration-200"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-primary-700 mb-1 font-inter"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 
                             border border-primary-200 placeholder-primary-400 
                             text-primary-900 focus:outline-none focus:ring-2 
                             focus:ring-primary-500 focus:border-primary-500 
                             text-sm font-inter transition-colors duration-200"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-primary-700 mb-1 font-inter"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="appearance-none rounded-lg relative block w-full px-3 py-2 
                               border border-primary-200 placeholder-primary-400 
                               text-primary-900 focus:outline-none focus:ring-2 
                               focus:ring-primary-500 focus:border-primary-500 
                               text-sm font-inter transition-colors duration-200"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-primary-700 mb-1 font-inter"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="appearance-none rounded-lg relative block w-full px-3 py-2 
                               border border-primary-200 placeholder-primary-400 
                               text-primary-900 focus:outline-none focus:ring-2 
                               focus:ring-primary-500 focus:border-primary-500 
                               text-sm font-inter transition-colors duration-200"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent 
                         rounded-lg shadow-md text-sm font-medium text-white 
                         bg-gradient-to-r from-primary-500 to-secondary-500
                         hover:from-primary-600 hover:to-secondary-600
                         focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-primary-500 disabled:opacity-50 
                         transition-all duration-200 font-inter mt-6"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="text-center text-sm mt-4">
                <p className="text-primary-600 font-inter">
                  Already have an account?{" "}
                  <button
                    onClick={() => router.push("/login")}
                    className="font-medium text-accent hover:text-accent-dark 
                             focus:outline-none focus:underline 
                             transition-colors duration-200"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
