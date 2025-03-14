import React from 'react';
import { MapPin, Menu, Award } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface NavbarProps {
  onAuthClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAuthClick }) => {
  const { user, signOut } = useAuthStore();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Way2Go</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-green-600">Route Planner</a>
            <a href="#" className="text-gray-700 hover:text-green-600">Carpooling</a>
            {user && (
              <div className="flex items-center space-x-2 text-gray-700">
                <Award className="h-5 w-5 text-green-600" />
                <span>{user.eco_points} points</span>
              </div>
            )}
            {user ? (
              <button 
                onClick={() => signOut()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Sign Out
              </button>
            ) : (
              <button 
                onClick={onAuthClick}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Sign In
              </button>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <Menu className="h-6 w-6 text-gray-700" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;