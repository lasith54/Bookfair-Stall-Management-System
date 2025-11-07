import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import cibfLogo from "@/assets/CIBF-Logo-Web.png";

interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Array<{ msg: string }>;
    };
  };
  message?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      const error = err as ApiError;
      setError(
        error.response?.data?.message || 
        error.message || 
        "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-screen overflow-x-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <img 
                  src={cibfLogo} 
                  alt="CIBF Logo" 
                  className="h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
              <div className="flex flex-col">
                <h1 className="text-xl text-blue-800 leading-tight">
                  Colombo International
                </h1>
                <h2 className="text-3xl font-bold text-blue-800 leading-tight">
                  Book Fair
                </h2>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <main className="w-full px-2 sm:px-4 lg:px-6 py-16">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-200px)]">
            {/* Left Side - Welcome Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-blue-950 mb-6">
                Welcome Back to CIBF 2025
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Sign in to your account to manage your stall reservations for the 
                Colombo International Book Fair 2025. Access your dashboard, view 
                available stalls, and complete your bookings.
              </p>
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-950 mb-4">
                  What you can do after signing in:
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    View interactive venue map
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Reserve up to 3 stalls per business
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Manage your reservations
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Download QR codes for entry
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-blue-950 mb-2">
                    Sign In
                  </h2>
                  <p className="text-gray-600">
                    Enter your credentials to access your account
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="Enter your password"
                      />
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="rememberMe"
                        type="checkbox"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                      Forgot password?
                    </a>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3"
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                {/* Divider */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                    </div>
                  </div>
                </div>

                {/* Register Link */}
                <div className="mt-6">
                  <Link to="/register">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-blue-800 text-blue-800 hover:bg-blue-50"
                    >
                      Create New Account
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact us at{" "}
              <a href="mailto:srilankabookpublishers@gmail.com" className="text-blue-600 hover:text-blue-800">
                srilankabookpublishers@gmail.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}