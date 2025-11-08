import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User, Building, Phone, MapPin, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import cibfLogo from "@/assets/CIBF-Logo-Web.png";

// Add error type interface
interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Array<{ msg: string }>;
    };
  };
  message?: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    accountType: "vendor" as "vendor" | "publisher",
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    businessName: "",
    address: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.terms) {
      setError("Please accept the terms and conditions");
      return;
    }

    // Format phone number to include +94 if not present
    let phoneNumber = formData.contactNumber.replace(/\s/g, '');
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = phoneNumber.startsWith('0') 
        ? `+94${phoneNumber.substring(1)}` 
        : `+94${phoneNumber}`;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        businessName: formData.businessName,
        contactNumber: phoneNumber,
        address: formData.address,
        role: formData.accountType,
      });
      navigate("/");
    } catch (err) {
      const error = err as ApiError;
      setError(
        error.response?.data?.message || 
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" || type === "radio" ? (type === "checkbox" ? checked : value) : value,
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

      {/* Register Form */}
      <main className="w-full px-2 sm:px-4 lg:px-6 py-16">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Left Side - Welcome Content */}
            <div className="lg:col-span-2">
              <div className="sticky top-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-blue-950 mb-6">
                  Join CIBF 2025
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Register as a publisher or vendor to secure your stall at the 
                  largest book fair in Sri Lanka. Connect with thousands of book 
                  lovers and grow your literary business.
                </p>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-950 mb-4">
                      Why participate in CIBF 2025?
                    </h3>
                    <ul className="text-gray-700 space-y-3">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></span>
                        <span>Access to 100K+ annual visitors and book enthusiasts</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></span>
                        <span>Network with 500+ exhibitors from around the world</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></span>
                        <span>10 days of continuous literary celebration</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2"></span>
                        <span>Prime location at BMICH, Colombo</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-950 mb-4">
                      Event Details
                    </h3>
                    <div className="text-gray-700 space-y-2">
                      <p><strong>Dates:</strong> 27th September - 6th October 2025</p>
                      <p><strong>Time:</strong> 9:00 AM - 9:00 PM daily</p>
                      <p><strong>Venue:</strong> BMICH, Bauddhaloka Mawatha, Colombo 07</p>
                      <p><strong>Stall Limit:</strong> Up to 3 stalls per business</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-blue-950 mb-2">
                    Create Your Account
                  </h2>
                  <p className="text-gray-600">
                    Fill in your details to register for CIBF 2025
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Account Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Account Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-md hover:border-blue-500 cursor-pointer">
                        <input
                          id="vendor"
                          name="accountType"
                          type="radio"
                          value="vendor"
                          checked={formData.accountType === "vendor"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 cursor-pointer">
                          Local Publisher/Vendor
                        </label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-md hover:border-blue-500 cursor-pointer">
                        <input
                          id="publisher"
                          name="accountType"
                          type="radio"
                          value="publisher"
                          checked={formData.accountType === "publisher"}
                          onChange={handleChange}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 cursor-pointer">
                          International Publisher/Vendor
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                          placeholder="Enter your first name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <div>
                      <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          id="contactNumber"
                          name="contactNumber"
                          required
                          value={formData.contactNumber}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                          placeholder="0771234567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Information */}
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                      Business/Organization Name
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                        placeholder="Enter your business or organization name"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        id="address"
                        name="address"
                        rows={3}
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                        placeholder="Enter your complete business address"
                      ></textarea>
                    </div>
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          placeholder="Create a password"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                          placeholder="Confirm your password"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      checked={formData.terms}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <label htmlFor="terms" className="ml-3 block text-sm text-gray-700">
                      I agree to the{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-800">Terms and Conditions</a>
                      {" "}and{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
                      {" "}of the Colombo International Book Fair.
                    </label>
                  </div>

                  {/* Register Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                {/* Divider */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                    </div>
                  </div>
                </div>

                {/* Login Link */}
                <div className="mt-6">
                  <Link to="/login">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-blue-800 text-blue-800 hover:bg-blue-50"
                    >
                      Sign In to Existing Account
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need assistance with registration? Contact us at{" "}
              <a href="mailto:srilankabookpublishers@gmail.com" className="text-blue-600 hover:text-blue-800">
                srilankabookpublishers@gmail.com
              </a>
              {" "}or call{" "}
              <a href="tel:+94112785480" className="text-blue-600 hover:text-blue-800">
                +94 11 2785480
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}