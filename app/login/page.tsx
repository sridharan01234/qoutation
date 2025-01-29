"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else if (res?.ok) {
        router.push(callbackUrl);
      }
    } catch (error) {
      setError("An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      await signIn("google", {
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to sign in with Google");
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-primary-100">
        <div className="grid md:grid-cols-5 gap-6">
          {/* Left Section with Background */}
          <div className="md:col-span-2 bg-gradient-to-br from-primary-500 to-secondary-500 p-6 rounded-l-xl hidden md:flex md:flex-col md:justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold font-playfair mb-4">Welcome Back!</h2>
              <p className="text-sm font-inter text-white/90">
                Sign in to your account and continue your journey with us.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-inter">Secure Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-inter">Personalized Dashboard</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-inter">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="md:col-span-3 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-primary-800 font-playfair">
                Welcome Back
              </h2>
              <p className="text-sm text-primary-600 font-inter mt-1">
                Sign in to continue to your account
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 
                       bg-white border-2 border-primary-200 rounded-xl shadow-sm 
                       text-primary-700 hover:bg-primary-50 hover:border-primary-300
                       focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-primary-500 disabled:opacity-50 
                       transition-all duration-200 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                {/* Google SVG paths */}
              </svg>
              <span className="font-medium text-base">Continue with Google</span>
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-primary-100" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-primary-500 font-medium">
                  Or continue with email
                </span>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-primary-50/50 backdrop-blur-sm border-2 border-primary-200 
                             text-primary-700 px-4 py-3 rounded-xl text-sm flex items-center 
                             gap-2 shadow-sm">
                  <svg
                    className="w-5 h-5 text-primary-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="flex-1">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full px-4 py-3 
                             border-2 border-primary-200 rounded-xl
                             placeholder-primary-400 focus:outline-none 
                             focus:ring-2 focus:ring-primary-500 
                             focus:border-primary-500 text-primary-900
                             bg-white/50 backdrop-blur-sm transition-all duration-200"
                    placeholder="you@example.com"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-primary-700">
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-sm font-medium text-accent hover:text-accent-dark 
                             transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full px-4 py-3 
                             border-2 border-primary-200 rounded-xl
                             placeholder-primary-400 focus:outline-none 
                             focus:ring-2 focus:ring-primary-500 
                             focus:border-primary-500 text-primary-900
                             bg-white/50 backdrop-blur-sm transition-all duration-200"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg className="h-5 w-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 
                           border-2 border-primary-300 rounded transition-colors duration-200"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-primary-700">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 
                         border border-transparent rounded-xl text-base font-medium 
                         text-white bg-gradient-to-r from-primary-600 to-secondary-600
                         hover:from-primary-700 hover:to-secondary-700
                         focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-primary-500 disabled:opacity-50 
                         transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  'Sign in'
                )}
              </button>

              <p className="text-center text-sm text-primary-600 mt-4">
                Don't have an account?{' '}
                <Link 
                  href="/signup" 
                  className="font-medium text-accent hover:text-accent-dark 
                           transition-colors duration-200"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
}

export default function LoginPage() {
  return (
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
  );
}
