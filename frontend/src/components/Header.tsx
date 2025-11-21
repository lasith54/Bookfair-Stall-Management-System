import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import cibfLogo from "@/assets/CIBF-Logo-Web.png";
import { User, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "Book Fair" }: HeaderProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
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
                {title}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <Link to="/dashboard" className="text-blue-800 hover:text-blue-900 font-semibold text-lg transition-colors">
                Dashboard
              </Link>
            )}
            
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-800 hover:bg-blue-900 transition-colors"
                >
                  <User className="h-12 w-12 text-white" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.name || user?.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-black bg-white hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-blue-800 text-blue-800 hover:bg-blue-50"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-blue-800 hover:bg-blue-900 text-white"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
