import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Car, Train, Bike, Leaf, Award } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import TravelPlanner from './components/TravelPlanner';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { AuthModal } from './components/AuthModal';
import { useAuthStore } from './store/authStore';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Toaster position="top-right" />
      <Navbar onAuthClick={() => setIsAuthModalOpen(true)} />
      <Hero />
      <TravelPlanner />
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default App;