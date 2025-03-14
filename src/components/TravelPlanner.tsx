import React, { useState, useRef } from 'react';
import { MapPin, Calendar, Car, Train, Bike, Leaf, Clock, Ruler, Users, DollarSign, Camera, Phone, User, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ORS_API_KEY = '5b3ce3597851110001cf6248de5f029c6af3475e9fa986f5fc0641c6'; // Replace with your key

const TravelPlanner = () => {
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [carpoolMode, setCarpoolMode] = useState<'gender-specific' | 'general' | ''>('');
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [verifiedGender, setVerifiedGender] = useState(false);
  
  const [driverDetails, setDriverDetails] = useState({
    name: 'John Doe', // This would come from your auth system
    phoneNumber: '+1234567890', // This would come from your auth system
    plateNumber: 'ABC123',
    gender: 'male' // This would come from your auth system
  });

  const [carpoolDetails, setCarpoolDetails] = useState({
    seats: 1,
    pricePerSeat: 0,
    departureTime: '',
    description: '',
    preferredGender: 'any'
  });

  const [routeDetails, setRouteDetails] = useState<{
    distance: number;
    duration: number;
    carbonSaved: number;
    totalPrice?: number;
  } | null>(null);

  const transportModes = [
    { id: 'train', icon: Train, label: 'Public Transit', orsProfile: 'driving-car', carbonFactor: 0.04 },
    { id: 'bike', icon: Bike, label: 'Cycling', orsProfile: 'cycling-regular', carbonFactor: 0 },
    { id: 'car', icon: Car, label: 'Carpool', orsProfile: 'driving-car', carbonFactor: 0.07 },
  ];

  const getCoordinates = async (location: string) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
      const data = await res.json();
      if (data.length === 0) throw new Error('Location not found');
      return { lat: data[0].lat, lon: data[0].lon };
    } catch (error) {
      console.error(error);
      toast.error('Failed to find location');
      return null;
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera');
    }
  };

  const verifyGender = async () => {
    if (!videoRef.current) return;
    
    try {
      // Here you would typically:
      // 1. Capture the current frame from video
      // 2. Send it to a face recognition API
      // 3. Verify the gender matches what's claimed
      
      // For demo purposes, we'll simulate a successful verification
      setVerifiedGender(true);
      setShowCamera(false);
      toast.success('Gender verified successfully!');
      
      // Stop the camera stream
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Error verifying gender:', error);
      toast.error('Failed to verify gender');
    }
  };

  const handleFindRoutes = async () => {
    if (!startLocation || !endLocation || !selectedMode) {
      toast.error('Please fill in all fields');
      return;
    }

    if (selectedMode === 'car') {
      if (!carpoolMode) {
        toast.error('Please select a carpool mode (Gender Specific or General)');
        return;
      }
      
      if (carpoolMode === 'gender-specific' && !verifiedGender) {
        toast.error('Please verify your gender first');
        return;
      }

      if (!carpoolDetails.seats || !carpoolDetails.departureTime) {
        toast.error('Please fill in all carpool details');
        return;
      }
    }

    setLoading(true);
    try {
      const selectedTransport = transportModes.find(mode => mode.id === selectedMode);
      if (!selectedTransport) throw new Error('Invalid transport mode');

      const startCoords = await getCoordinates(startLocation);
      const endCoords = await getCoordinates(endLocation);
      if (!startCoords || !endCoords) return;

      const routeRes = await fetch('https://api.openrouteservice.org/v2/directions/' + selectedTransport.orsProfile, {
        method: 'POST',
        headers: { 'Authorization': ORS_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coordinates: [[parseFloat(startCoords.lon), parseFloat(startCoords.lat)], [parseFloat(endCoords.lon), parseFloat(endCoords.lat)]],
          format: 'json'
        }),
      });

      const routeData = await routeRes.json();
      if (!routeData.routes) throw new Error('Route not found');

      const distance = routeData.routes[0].summary.distance / 1000; // Convert meters to km
      const duration = routeData.routes[0].summary.duration / 60; // Convert seconds to minutes
      const regularCarEmissions = distance * 0.12; // Regular car emissions per km
      const actualEmissions = distance * selectedTransport.carbonFactor;
      const carbonSaved = regularCarEmissions - actualEmissions;

      const totalPrice = selectedMode === 'car' ? carpoolDetails.pricePerSeat * carpoolDetails.seats : undefined;

      setRouteDetails({
        distance: parseFloat(distance.toFixed(1)),
        duration: parseFloat(duration.toFixed(1)),
        carbonSaved: parseFloat(carbonSaved.toFixed(2)),
        totalPrice
      });

      setShowReview(true);
    } catch (error) {
      console.error('Error finding routes:', error);
      toast.error('Failed to calculate route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Your Journey</h2>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Starting point"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Destination"
              value={endLocation}
              onChange={(e) => setEndLocation(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {transportModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all
                  ${selectedMode === mode.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}
              >
                <mode.icon className={`h-8 w-8 ${selectedMode === mode.id ? 'text-green-500' : 'text-gray-500'}`} />
                <span className="mt-2 text-sm font-medium">{mode.label}</span>
              </button>
            ))}
          </div>

          {selectedMode === 'car' && (
            <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Carpool Details</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setCarpoolMode('gender-specific')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    carpoolMode === 'gender-specific' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  Gender Specific
                </button>
                <button
                  onClick={() => setCarpoolMode('general')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    carpoolMode === 'general' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  General (Open to All)
                </button>
              </div>

              {carpoolMode === 'gender-specific' && !verifiedGender && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span>Gender Verification Required</span>
                    <button
                      onClick={startCamera}
                      className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      <Camera className="h-5 w-5" />
                      <span>Start Verification</span>
                    </button>
                  </div>
                  
                  {showCamera && (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg"
                      />
                      <button
                        onClick={verifyGender}
                        className="absolute bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md"
                      >
                        Verify
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-white p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-4">Driver Details</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-4">
                    <User className="h-5 w-5 text-gray-400" />
                    <span>{driverDetails.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>{driverDetails.phoneNumber}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Car className="h-5 w-5 text-gray-400" />
                    <span>Plate Number: {driverDetails.plateNumber}</span>
                  </div>
                  {carpoolMode === 'gender-specific' && (
                    <div className="flex items-center space-x-4">
                      <User className="h-5 w-5 text-gray-400" />
                      <span>Gender: {driverDetails.gender}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-4">
                  <Users className="h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="8"
                    placeholder="Available seats"
                    value={carpoolDetails.seats}
                    onChange={(e) => setCarpoolDetails(prev => ({ ...prev, seats: parseInt(e.target.value) }))}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    placeholder="Price per seat"
                    value={carpoolDetails.pricePerSeat}
                    onChange={(e) => setCarpoolDetails(prev => ({ ...prev, pricePerSeat: parseFloat(e.target.value) }))}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <input
                    type="datetime-local"
                    placeholder="Departure time"
                    value={carpoolDetails.departureTime}
                    onChange={(e) => setCarpoolDetails(prev => ({ ...prev, departureTime: e.target.value }))}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {carpoolMode === 'gender-specific' && (
                  <div className="flex items-center space-x-4">
                    <User className="h-5 w-5 text-gray-400" />
                    <select
                      value={carpoolDetails.preferredGender}
                      onChange={(e) => setCarpoolDetails(prev => ({ ...prev, preferredGender: e.target.value }))}
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="any">Any Gender</option>
                      <option value="male">Male Only</option>
                      <option value="female">Female Only</option>
                    </select>
                  </div>
                )}

                <div className="flex items-center space-x-4 col-span-2">
                  <textarea
                    placeholder="Additional details (optional)"
                    value={carpoolDetails.description}
                    onChange={(e) => setCarpoolDetails(prev => ({ ...prev, description: e.target.value }))}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={handleFindRoutes}
            disabled={loading}
            className={`w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Leaf className="h-5 w-5" />
            <span>{loading ? 'Calculating...' : 'Find Eco-Friendly Routes'}</span>
          </button>
        </div>

        {showReview && routeDetails && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Route Review</h3>
            <div className="bg-green-50 rounded-lg p-6">
              <div className="grid grid-cols-3 gap-6">
                <div><Clock className="h-5 w-5 text-green-600" /> {routeDetails.duration} mins</div>
                <div><Ruler className="h-5 w-5 text-green-600" /> {routeDetails.distance} km</div>
                <div><Leaf className="h-5 w-5 text-green-600" /> {routeDetails.carbonSaved} kg CO₂ saved</div>
                {selectedMode === 'car' && routeDetails.totalPrice && (
                  <div><DollarSign className="h-5 w-5 text-green-600" /> Total potential earnings: ${routeDetails.totalPrice}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelPlanner;
