import React, { useState, useRef } from 'react';
import { MapPin, Calendar, Car, Train, Bike, Leaf, Clock, Ruler, Users, DollarSign, Camera, Phone, User, FileText, Bus, Zap, Fuel, Train as Metro, Lock, Mail, Menu } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ORS_API_KEY = '5b3ce3597851110001cf6248de5f029c6af3475e9fa986f5fc0641c6'; // Replace with your key

// Mock nearby drivers data - In real app, this would come from your backend
const nearbyDrivers = [
  { id: 1, name: "Sarah Smith", gender: "female", rating: 4.8, distance: 2.3, timeToReach: 8, plateNumber: "KA01AB1234" },
  { id: 2, name: "Emily Johnson", gender: "female", rating: 4.9, distance: 3.1, timeToReach: 12, plateNumber: "KA02CD5678" },
  { id: 3, name: "John Doe", gender: "male", rating: 4.7, distance: 1.8, timeToReach: 5, plateNumber: "KA03EF9012" },
  { id: 4, name: "Mary Wilson", gender: "female", rating: 4.6, distance: 4.0, timeToReach: 15, plateNumber: "KA04GH3456" }
];

// Mock data for different transport options
const mockTransportData = {
  trains: [
    { id: 1, name: "Express 101", departure: "08:00", arrival: "09:30", price: 120, route: "Central - North - East" },
    { id: 2, name: "Local 202", departure: "08:30", arrival: "10:00", price: 80, route: "South - Central - North" },
    { id: 3, name: "Superfast 303", departure: "09:00", arrival: "10:15", price: 150, route: "West - Central - East" }
  ],
  buses: [
    { id: 1, name: "Route 1A", departure: "Every 15 mins", price: 40, route: "Downtown Loop" },
    { id: 2, name: "Route 2B", departure: "Every 20 mins", price: 35, route: "Suburban Connect" },
    { id: 3, name: "Express 3C", departure: "Every 30 mins", price: 50, route: "Airport Link" }
  ],
  metro: [
    { id: 1, name: "Blue Line", frequency: "Every 5 mins", price: 30, route: "East-West Corridor" },
    { id: 2, name: "Red Line", frequency: "Every 4 mins", price: 25, route: "North-South Corridor" },
    { id: 3, name: "Green Line", frequency: "Every 6 mins", price: 35, route: "Central Loop" }
  ],
  bikeStations: [
    { id: 1, name: "Central Park Station", bikes: 15, distance: "0.5 km", price: 20 },
    { id: 2, name: "Market Square Hub", bikes: 8, distance: "0.8 km", price: 20 },
    { id: 3, name: "Tech Park Point", bikes: 12, distance: "1.2 km", price: 20 }
  ],
  greenVehicles: {
    ev: [
      { 
        id: 1, 
        name: "Tesla Model 3", 
        range: "350 km", 
        price: 18, 
        type: "Sedan",
        driver: {
          name: "Alex Johnson",
          phoneNumber: "+91 98765 43210",
          plateNumber: "DL01AB1234",
          rating: 4.8
        }
      },
      { 
        id: 2, 
        name: "Nexon EV", 
        range: "300 km", 
        price: 15, 
        type: "SUV",
        driver: {
          name: "Sarah Wilson",
          phoneNumber: "+91 98765 43211",
          plateNumber: "DL02CD5678",
          rating: 4.9
        }
      },
      { 
        id: 3, 
        name: "Tiago EV", 
        range: "250 km", 
        price: 12, 
        type: "Hatchback",
        driver: {
          name: "Raj Patel",
          phoneNumber: "+91 98765 43212",
          plateNumber: "DL03EF9012",
          rating: 4.7
        }
      }
    ],
    cng: [
      { 
        id: 1, 
        name: "Dzire CNG", 
        range: "400 km", 
        price: 10, 
        type: "Sedan",
        driver: {
          name: "Priya Singh",
          phoneNumber: "+91 98765 43213",
          plateNumber: "DL04GH3456",
          rating: 4.8
        }
      },
      { 
        id: 2, 
        name: "Ertiga CNG", 
        range: "450 km", 
        price: 12, 
        type: "MPV",
        driver: {
          name: "Mike Chen",
          phoneNumber: "+91 98765 43214",
          plateNumber: "DL05IJ7890",
          rating: 4.9
        }
      },
      { 
        id: 3, 
        name: "WagonR CNG", 
        range: "350 km", 
        price: 8, 
        type: "Hatchback",
        driver: {
          name: "Amit Kumar",
          phoneNumber: "+91 98765 43215",
          plateNumber: "DL06KL1234",
          rating: 4.7
        }
      }
    ],
    auto: [
      { 
        id: 1, 
        name: "Auto Rickshaw 1", 
        range: "200 km", 
        price: 15, 
        type: "Auto",
        driver: {
          name: "Ramesh Kumar",
          phoneNumber: "+91 98765 43216",
          plateNumber: "DL07MN4567",
          rating: 4.8
        }
      },
      { 
        id: 2, 
        name: "Auto Rickshaw 2", 
        range: "180 km", 
        price: 14, 
        type: "Auto",
        driver: {
          name: "Suresh Singh",
          phoneNumber: "+91 98765 43217",
          plateNumber: "DL08OP8901",
          rating: 4.7
        }
      },
      { 
        id: 3, 
        name: "Auto Rickshaw 3", 
        range: "190 km", 
        price: 13, 
        type: "Auto",
        driver: {
          name: "Abdul Khan",
          phoneNumber: "+91 98765 43218",
          plateNumber: "DL09QR2345",
          rating: 4.9
        }
      }
    ]
  }
};

const TravelPlanner = () => {
  const [selectedMode, setSelectedMode] = useState<string>('');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [carpoolMode, setCarpoolMode] = useState<'gender-specific' | 'general' | ''>('');
  const [showCamera, setShowCamera] = useState(false);
  const [showDrivers, setShowDrivers] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [verifiedGender, setVerifiedGender] = useState(false);
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | ''>('');
  const [showGenderSelection, setShowGenderSelection] = useState(false);
  
  const [driverDetails, setDriverDetails] = useState({
    name: 'John Doe', // This would come from your auth system
    phoneNumber: '+1234567890', // This would come from your auth system
    plateNumber: 'ABC123',
    gender: 'male' // This would come from your auth system
  });

  const [carpoolDetails, setCarpoolDetails] = useState({
    seats: 1,
    preferredGender: 'any'
  });

  const [routeDetails, setRouteDetails] = useState<{
    distance: number;
    duration: number;
    carbonSaved: number;
    price?: number;
  } | null>(null);

  const [journeyMode, setJourneyMode] = useState<'green-express' | 'eco-saver' | 'carpool' | ''>('');
  const [selectedVehicleType, setSelectedVehicleType] = useState<'ev' | 'cng' | 'auto' | ''>('');
  const [selectedEcoMode, setSelectedEcoMode] = useState<'train' | 'bus' | 'metro' | 'bike' | ''>('');
  const [transportOptions, setTransportOptions] = useState<any[]>([]);
  const [optimalRoute, setOptimalRoute] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  // Add new state for authentication
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [authForm, setAuthForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // Add refs for scrolling
  const journeyRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  // Add state for menu
  const [showMenu, setShowMenu] = useState(false);

  const transportModes = [
    { id: 'train', icon: Train, label: 'Public Transit', orsProfile: 'driving-car', carbonFactor: 0.04 },
    { id: 'bike', icon: Bike, label: 'Cycling', orsProfile: 'cycling-regular', carbonFactor: 0 },
    { id: 'car', icon: Car, label: 'Carpool', orsProfile: 'driving-car', carbonFactor: 0.07 },
  ];

  const getCoordinates = async (location: string) => {
    try {
      // Add specific location handling for Kerala
      const locationMap: { [key: string]: { lat: number; lon: number; isLongDistance?: boolean } } = {
        'rajagiri school of engineering and technology': { lat: 10.0261, lon: 76.3125 },
        'kakkanad': { lat: 10.0158, lon: 76.3418 },
        'palarivattom': { lat: 10.0082, lon: 76.3041 },
        'edappally': { lat: 10.0246, lon: 76.3088 },
        'kaloor': { lat: 9.9894, lon: 76.2867 },
        'aluva': { lat: 10.1004, lon: 76.3571 },
        'vytilla': { lat: 9.9712, lon: 76.3183 },
        'infopark': { lat: 10.0147, lon: 76.3654 },
        'smart city': { lat: 10.0127, lon: 76.3637 },
        'fort kochi': { lat: 9.9658, lon: 76.2421 },
        'kottayam': { lat: 9.5916, lon: 76.5222, isLongDistance: true },
        'changanassery': { lat: 9.4477, lon: 76.5413, isLongDistance: true },
        'ernakulam': { lat: 9.9816, lon: 76.2999 }
      };

      // Clean and check input
      const cleanLocation = location.toLowerCase().trim();
      for (const [key, coords] of Object.entries(locationMap)) {
        if (cleanLocation.includes(key)) {
          return coords;
        }
      }

      // If not found in map, try OpenStreetMap
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)},Kerala,India&countrycodes=in&limit=1`
      );
      const data = await res.json();
      if (data.length === 0) {
        toast.error(`Location not found: ${location}`);
        return null;
      }
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    } catch (error) {
      console.error('Error finding location:', error);
      toast.error('Failed to find location. Please try again.');
      return null;
    }
  };

  const handleLocationChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartLocation(value);
    } else {
      setEndLocation(value);
    }
    // Reset all selections when location changes
    setSelectedMode('');
    setJourneyMode('');
    setSelectedVehicleType('');
    setSelectedEcoMode('');
    setTransportOptions([]);
    setOptimalRoute(null);
    setShowReview(false);
    setRouteDetails(null);
    setSelectedVehicle(null);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km

    // Add 20% to account for road routes vs direct distance
    return distance * 1.2;
  };

  const calculateDuration = (distance: number, mode: string): number => {
    // More realistic speeds in km/h for Kerala traffic conditions
    const baseSpeed: { [key: string]: number } = {
      'car': 35,
      'ev': 35,
      'cng': 30,
      'auto': 25,
      'bike': 30,
      'train': 45,
      'metro': 32,
      'bus': 20
    };

    // Get current hour for peak time calculation
    const currentHour = new Date().getHours();
    
    // Define peak hours (morning and evening rush hours)
    const isPeakHour = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 16 && currentHour <= 19);
    
    // Traffic factors based on location and distance
    let trafficFactor = 1.0;
    
    // Add peak hour factor
    if (isPeakHour) {
      trafficFactor *= 1.5;
    }
    
    // Add distance-based factor
    if (distance <= 5) {
      trafficFactor *= 1.2; // More traffic in city/short distances
    } else if (distance <= 10) {
      trafficFactor *= 1.1;
    } else if (distance > 20) {
      // For longer distances, traffic impact reduces slightly
      trafficFactor *= 0.9;
    }
    
    const speed = baseSpeed[mode] || 25;
    const baseTime = (distance / speed) * 60; // Base time in minutes
    
    // Add location-specific delays
    const additionalTime = calculateLocationSpecificDelay(startLocation, endLocation);
    
    return Math.max((baseTime * trafficFactor) + additionalTime, 10); // Minimum 10 minutes
  };

  const calculateLocationSpecificDelay = (start: string, end: string): number => {
    // Known high-traffic areas and their additional delays in minutes
    const highTrafficAreas = {
      'edappally': 15,
      'palarivattom': 12,
      'kaloor': 10,
      'kakkanad': 8,
      'infopark': 10,
      'vytilla': 15,
      'mg road': 12,
      'aluva': 8
    };

    let additionalDelay = 0;
    const startLower = start.toLowerCase();
    const endLower = end.toLowerCase();

    // Check if either start or end point is in a high-traffic area
    for (const [area, delay] of Object.entries(highTrafficAreas)) {
      if (startLower.includes(area) || endLower.includes(area)) {
        additionalDelay += delay;
      }
    }

    // Special cases for specific routes
    if ((startLower.includes('rajagiri') && endLower.includes('palarivattom')) ||
        (startLower.includes('palarivattom') && endLower.includes('rajagiri'))) {
      // Rajagiri to Palarivattom specific route timing
      return 25; // Approximately 25 minutes during normal traffic
    }

    if ((startLower.includes('kakkanad') && endLower.includes('edappally')) ||
        (startLower.includes('edappally') && endLower.includes('kakkanad'))) {
      return 30; // Approximately 30 minutes during normal traffic
    }

    return additionalDelay;
  };

  const startCamera = async () => {
    if (!selectedGender) {
      toast.error('Please select your gender first');
      return;
    }

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
    if (!videoRef.current || !selectedGender) return;
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');
      
      // Capture the current frame
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');

      // Simulating API call and gender detection
      const detectedGender = await simulateGenderDetection(imageData);
      
      if (detectedGender === selectedGender) {
        setVerifiedGender(true);
        setShowCamera(false);
        toast.success('Gender verified successfully!');
        
        // Filter and show nearby drivers based on gender preference
        const filteredDrivers = nearbyDrivers.filter(
          driver => driver.gender === selectedGender
        );
        setAvailableDrivers(filteredDrivers);
        setShowDrivers(true);
      } else {
        toast.error('Gender verification failed. The detected gender does not match your selection.');
        // Stop the camera and reset
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setShowCamera(false);
      }
    } catch (error) {
      console.error('Error verifying gender:', error);
      toast.error('Failed to verify gender');
    }
  };

  // Simulate gender detection API call
  const simulateGenderDetection = async (imageData: string): Promise<string> => {
    // In a real application, this would be an API call to a face recognition service
    // For demo purposes, we're returning a random result
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.5 ? 'male' : 'female');
      }, 1500);
    });
  };

  const calculatePrice = (distance: number, mode: string = 'auto'): number => {
    const baseRate = 10; // ₹10 per km
    let price = distance * baseRate;

    // Add distance-based surcharge for longer distances
    if (distance > 20) {
      price *= 1.1; // 10% surcharge for distances over 20km
    }
    if (distance > 50) {
      price *= 1.2; // Additional 20% surcharge for distances over 50km
    }

    return Math.ceil(price);
  };

  const handleFindRoutes = async () => {
    if (!startLocation || !endLocation) {
      toast.error('Please enter both starting point and destination');
      return;
    }

    setLoading(true);
    try {
      const startCoords = await getCoordinates(startLocation);
      const endCoords = await getCoordinates(endLocation);
      
      if (!startCoords || !endCoords) {
        setLoading(false);
        return;
      }

      // Calculate direct distance
      const distance = calculateDistance(
        startCoords.lat,
        startCoords.lon,
        endCoords.lat,
        endCoords.lon
      );

      let duration: number;
      let price: number;
      let actualEmissions: number;
      const regularCarEmissions = distance * 0.12;

      if (journeyMode === 'eco-saver') {
        const optimal = calculateOptimalRoute(startLocation, endLocation, distance);
        setOptimalRoute(optimal);
        duration = optimal.totalTime;
        price = optimal.totalPrice;
        actualEmissions = distance * 0.04;
      } else {
        duration = calculateDuration(distance, selectedVehicleType || 'car');
        price = calculatePrice(distance, selectedVehicleType);
        actualEmissions = selectedVehicleType === 'ev' ? 0 : distance * 0.08;
      }

      const carbonSaved = regularCarEmissions - actualEmissions;

      setRouteDetails({
        distance: parseFloat(distance.toFixed(1)),
        duration: parseFloat(duration.toFixed(1)),
        carbonSaved: parseFloat(carbonSaved.toFixed(2)),
        price: parseFloat(price.toFixed(2))
      });

      // Show appropriate success message
      if (journeyMode === 'green-express' && selectedVehicle) {
        const arrivalTime = new Date(Date.now() + duration * 60000);
        toast.success(
          `Ride confirmed with ${selectedVehicle.driver.name}! ETA: ${arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        );
      } else if (journeyMode === 'eco-saver') {
        const hours = Math.floor(duration / 60);
        const minutes = Math.ceil(duration % 60);
        const timeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        toast.success(`Route confirmed! Total journey time: ${timeString}`);
      }

      setShowReview(true);
    } catch (error) {
      console.error('Error calculating route:', error);
      toast.error('Failed to calculate route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isLongDistanceRoute = (start: string, end: string): boolean => {
    const longDistanceLocations = ['kottayam', 'changanassery'];
    const startLower = start.toLowerCase();
    const endLower = end.toLowerCase();

    return longDistanceLocations.some(loc => 
      startLower.includes(loc) || endLower.includes(loc)
    );
  };

  const calculateOptimalRoute = (startLoc: string, endLoc: string, distance: number) => {
    // Calculate optimal combinations based on distance and location
    const isKochiOrBangalore = isLocationInMetroCity(startLoc, endLoc);
    const isLongDistance = isLongDistanceRoute(startLoc, endLoc);
    const totalPrice = calculatePrice(distance);
    const duration = calculateDuration(distance, 'auto');
    
    // For long distances (over 30km or duration > 60 mins) or known long-distance routes, prefer train
    if (isLongDistance || duration > 60 || distance > 30) {
      const trainDuration = calculateDuration(distance, 'train');
      const autoToStationDistance = 2;
      const trainDistance = distance - (autoToStationDistance * 2);
      
      return {
        combination: "Train + Auto",
        totalPrice: totalPrice,
        totalTime: trainDuration + 30, // Adding 30 mins for transfers
        showTrainOption: true,
        steps: [
          { 
            mode: "Auto to Station", 
            duration: "15 mins", 
            price: calculatePrice(autoToStationDistance) 
          },
          { 
            mode: "Train", 
            duration: `${Math.ceil(calculateDuration(trainDistance, 'train'))} mins`, 
            price: calculatePrice(trainDistance, 'train') 
          },
          { 
            mode: "Auto from Station", 
            duration: "15 mins", 
            price: calculatePrice(autoToStationDistance) 
          }
        ]
      };
    }
    
    if (distance <= 3) {
      // For short distances, use auto only
      return {
        combination: "Auto Only",
        totalPrice: totalPrice,
        totalTime: Math.ceil(duration),
        showTrainOption: false,
        steps: [
          { mode: "Auto", duration: `${Math.ceil(duration)} mins`, price: totalPrice }
        ]
      };
    }

    // For medium distances (3-7 km), calculate Auto+Bus combination
    if (distance <= 7) {
      const autoDistance = 1.5;
      const busDistance = distance - autoDistance;
      const totalDuration = calculateDuration(autoDistance, 'auto') + calculateDuration(busDistance, 'bus') + 5;
      
      return {
        combination: "Auto + Bus",
        totalPrice: totalPrice,
        totalTime: Math.ceil(totalDuration),
        showTrainOption: false,
        steps: [
          { mode: "Auto", duration: `${Math.ceil(calculateDuration(autoDistance, 'auto'))} mins`, price: calculatePrice(autoDistance) },
          { mode: "Bus", duration: `${Math.ceil(calculateDuration(busDistance, 'bus'))} mins`, price: calculatePrice(busDistance) }
        ]
      };
    }

    // For longer distances with metro access
    if (isKochiOrBangalore) {
      const autoDistance = 1.5;
      const metroDistance = distance - (autoDistance * 2); // Account for auto at both ends
      const totalDuration = calculateDuration(autoDistance, 'auto') * 2 + calculateDuration(metroDistance, 'metro') + 10;
      
      return {
        combination: "Auto + Metro + Auto",
        totalPrice: totalPrice,
        totalTime: Math.ceil(totalDuration),
        showTrainOption: duration > 60,
        steps: [
          { mode: "Auto to Metro", duration: `${Math.ceil(calculateDuration(autoDistance, 'auto'))} mins`, price: calculatePrice(autoDistance) },
          { mode: "Metro", duration: `${Math.ceil(calculateDuration(metroDistance, 'metro'))} mins`, price: calculatePrice(metroDistance) },
          { mode: "Auto from Metro", duration: `${Math.ceil(calculateDuration(autoDistance, 'auto'))} mins`, price: calculatePrice(autoDistance) }
        ]
      };
    }

    // Default to Auto + Bus for longer distances without metro access
    const autoDistance = 1.5;
    const busDistance = distance - (autoDistance * 2);
    const totalDuration = calculateDuration(autoDistance, 'auto') * 2 + calculateDuration(busDistance, 'bus') + 10;
    
    return {
      combination: "Auto + Bus + Auto",
      totalPrice: totalPrice,
      totalTime: Math.ceil(totalDuration),
      showTrainOption: duration > 60,
      steps: [
        { mode: "Auto to Bus", duration: `${Math.ceil(calculateDuration(autoDistance, 'auto'))} mins`, price: calculatePrice(autoDistance) },
        { mode: "Bus", duration: `${Math.ceil(calculateDuration(busDistance, 'bus'))} mins`, price: calculatePrice(busDistance) },
        { mode: "Auto from Bus", duration: `${Math.ceil(calculateDuration(autoDistance, 'auto'))} mins`, price: calculatePrice(autoDistance) }
      ]
    };
  };

  const isLocationInMetroCity = (start: string, end: string): boolean => {
    const metroCities = [
      'kochi',
      'ernakulam',
      'bangalore',
      'bengaluru',
      'aluva',
      'edappally',
      'kaloor',
      'palarivattom',
      'vytilla',
      'kakkanad'
    ];

    const startLower = start.toLowerCase();
    const endLower = end.toLowerCase();

    return metroCities.some(city => 
      startLower.includes(city) || endLower.includes(city)
    );
  };

  const handleModeSelection = (mode: 'green-express' | 'eco-saver' | 'carpool') => {
    setJourneyMode(mode);
    setSelectedVehicleType('');
    setSelectedEcoMode('');
    setTransportOptions([]);
    setOptimalRoute(null);

    if (mode === 'eco-saver') {
      const optimal = calculateOptimalRoute(startLocation, endLocation, calculateDistance(0, 0, 0, 0));
      setOptimalRoute(optimal);
    }
  };

  const handleVehicleTypeSelection = (type: 'ev' | 'cng' | 'auto') => {
    setSelectedVehicleType(type);
    setTransportOptions(mockTransportData.greenVehicles[type]);
  };

  const handleEcoModeSelection = (mode: 'train' | 'bus' | 'metro' | 'bike') => {
    setSelectedEcoMode(mode);
    switch (mode) {
      case 'train':
        setTransportOptions(mockTransportData.trains);
        break;
      case 'bus':
        setTransportOptions(mockTransportData.buses);
        break;
      case 'metro':
        setTransportOptions(mockTransportData.metro);
        break;
      case 'bike':
        setTransportOptions(mockTransportData.bikeStations);
        break;
    }
  };

  const handleScroll = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Journey Planning Section */}
      <div ref={journeyRef} className="scroll-mt-8 bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Your Journey</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Starting point"
              value={startLocation}
              onChange={(e) => handleLocationChange('start', e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Destination"
              value={endLocation}
              onChange={(e) => handleLocationChange('end', e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <button
              onClick={() => handleModeSelection('green-express')}
              className={`p-4 rounded-lg border-2 transition-all ${
                journeyMode === 'green-express' ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
            >
              <Zap className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">GreenExpress Mode</span>
            </button>
            <button
              onClick={() => handleModeSelection('eco-saver')}
              className={`p-4 rounded-lg border-2 transition-all ${
                journeyMode === 'eco-saver' ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
            >
              <Leaf className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Eco-Saver Mode</span>
            </button>
            <button
              onClick={() => handleModeSelection('carpool')}
              className={`p-4 rounded-lg border-2 transition-all ${
                journeyMode === 'carpool' ? 'border-green-500 bg-green-50' : 'border-gray-200'
              }`}
            >
              <Car className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Carpool Mode</span>
            </button>
          </div>

          {journeyMode === 'green-express' && (
            <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Select Vehicle Type</h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    handleVehicleTypeSelection('ev');
                    setSelectedVehicle(null);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedVehicleType === 'ev' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <Zap className="h-6 w-6 mx-auto mb-2" />
                  <span>Electric Vehicles</span>
                </button>
                <button
                  onClick={() => {
                    handleVehicleTypeSelection('cng');
                    setSelectedVehicle(null);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedVehicleType === 'cng' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <Fuel className="h-6 w-6 mx-auto mb-2" />
                  <span>CNG Vehicles</span>
                </button>
                <button
                  onClick={() => {
                    handleVehicleTypeSelection('auto');
                    setSelectedVehicle(null);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedVehicleType === 'auto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <Car className="h-6 w-6 mx-auto mb-2" />
                  <span>Auto Rickshaw</span>
                </button>
              </div>

              {selectedVehicleType && transportOptions.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-3">Available Vehicles</h4>
                  <div className="space-y-3">
                    {transportOptions.map((vehicle) => (
                      <div 
                        key={vehicle.id} 
                        onClick={() => setSelectedVehicle(vehicle)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedVehicle?.id === vehicle.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{vehicle.name}</p>
                              <p className="text-sm text-gray-500">
                                Range: {vehicle.range} • Type: {vehicle.type}
                              </p>
                            </div>
                            <div className="text-green-600 font-semibold">
                              ₹{vehicle.price}/km
                            </div>
                          </div>
                          
                          {selectedVehicle?.id === vehicle.id && (
                            <div className="border-t pt-3 mt-3">
                              <h5 className="font-medium mb-2">Driver Details</h5>
                              <div className="space-y-2 text-sm">
                                <p><User className="inline h-4 w-4 mr-2" />{vehicle.driver.name}</p>
                                <p><Phone className="inline h-4 w-4 mr-2" />{vehicle.driver.phoneNumber}</p>
                                <p><FileText className="inline h-4 w-4 mr-2" />Plate: {vehicle.driver.plateNumber}</p>
                                <p>⭐ {vehicle.driver.rating} Rating</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedVehicle && (
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleFindRoutes()}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>Confirm Ride</span>
                      </button>
                      <button
                        onClick={() => setSelectedVehicle(null)}
                        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {journeyMode === 'eco-saver' && (
            <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Select Transport Mode</h3>
              
              {optimalRoute && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-700 mb-2">Recommended Combination</h4>
                  <div className="space-y-2">
                    <p className="text-green-600">
                      {optimalRoute.combination} • Total: ₹{optimalRoute.totalPrice} • {optimalRoute.totalTime} mins
                    </p>
                    <div className="space-y-1">
                      {optimalRoute.steps.map((step: any, index: number) => (
                        <p key={index} className="text-sm text-gray-600">
                          {step.mode}: {step.duration} - ₹{step.price}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {routeDetails && routeDetails.duration >= 60 && (
                  <button
                    onClick={() => handleEcoModeSelection('train')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedEcoMode === 'train' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <Train className="h-6 w-6 mx-auto mb-2" />
                    <span>Trains</span>
                  </button>
                )}
                <button
                  onClick={() => handleEcoModeSelection('bus')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedEcoMode === 'bus' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <Bus className="h-6 w-6 mx-auto mb-2" />
                  <span>Buses</span>
                </button>
                {isLocationInMetroCity(startLocation, endLocation) && (
                  <button
                    onClick={() => handleEcoModeSelection('metro')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedEcoMode === 'metro' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <Metro className="h-6 w-6 mx-auto mb-2" />
                    <span>Metro</span>
                  </button>
                )}
                <button
                  onClick={() => handleEcoModeSelection('bike')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedEcoMode === 'bike' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <Bike className="h-6 w-6 mx-auto mb-2" />
                  <span>Bikes</span>
                </button>
              </div>

              {selectedEcoMode && transportOptions.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-3">
                    {selectedEcoMode === 'bike' ? 'Available Bike Stations' : `Available ${selectedEcoMode.charAt(0).toUpperCase() + selectedEcoMode.slice(1)}s`}
                  </h4>
                  <div className="space-y-3">
                    {transportOptions.map((option) => (
                      <div 
                        key={option.id} 
                        onClick={() => setSelectedVehicle(option)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedVehicle?.id === option.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{option.name}</p>
                            {selectedEcoMode === 'bike' ? (
                              <p className="text-sm text-gray-500">
                                Available Bikes: {option.bikes} • Distance: {option.distance}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-500">
                                {option.departure || option.frequency} • {option.route}
                              </p>
                            )}
                          </div>
                          <div className="text-green-600 font-semibold">
                            ₹{option.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedVehicle && (
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleFindRoutes()}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>Book Ticket</span>
                      </button>
                      <button
                        onClick={() => setSelectedVehicle(null)}
                        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {journeyMode === 'carpool' && (
            <div className="mt-6 space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Carpool Details</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => {
                    setCarpoolMode('gender-specific');
                    setShowGenderSelection(true);
                    setShowDrivers(false);
                    setSelectedDriver(null);
                    setVerifiedGender(false);
                    setSelectedGender('');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    carpoolMode === 'gender-specific' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  Gender Specific
                </button>
                <button
                  onClick={() => {
                    setCarpoolMode('general');
                    setShowGenderSelection(false);
                    setShowDrivers(true);
                    setAvailableDrivers(nearbyDrivers);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    carpoolMode === 'general' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  General (Open to All)
                </button>
              </div>

              {carpoolMode === 'gender-specific' && showGenderSelection && !verifiedGender && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-4">Select Your Gender</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setSelectedGender('male')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedGender === 'male' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <User className="h-6 w-6 mx-auto mb-2" />
                      Male
                    </button>
                    <button
                      onClick={() => setSelectedGender('female')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedGender === 'female' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
                      }`}
                    >
                      <User className="h-6 w-6 mx-auto mb-2" />
                      Female
                    </button>
                  </div>

                  {selectedGender && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <span>Verify Your Gender</span>
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
                </div>
              )}

              {(verifiedGender || carpoolMode === 'general') && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Users className="h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      max="8"
                      placeholder="How many seats do you need?"
                      value={carpoolDetails.seats}
                      onChange={(e) => setCarpoolDetails(prev => ({ ...prev, seats: parseInt(e.target.value) }))}
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {showDrivers && availableDrivers.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-4">Available Drivers Nearby</h4>
                      <div className="space-y-4">
                        {availableDrivers.map(driver => (
                          <div
                            key={driver.id}
                            onClick={() => setSelectedDriver(driver)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedDriver?.id === driver.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{driver.name}</p>
                                <p className="text-sm text-gray-500">
                                  {driver.timeToReach} mins away • Rating: {driver.rating}⭐
                                </p>
                                <p className="text-sm text-gray-500">
                                  Plate: {driver.plateNumber}
                                </p>
                              </div>
                              {carpoolMode === 'gender-specific' && (
                                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {driver.gender}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {showDrivers && availableDrivers.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      No drivers available matching your criteria
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <button 
            onClick={handleFindRoutes}
            disabled={loading || (selectedMode === 'car' && !selectedDriver)}
            className={`w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors ${
              loading || (selectedMode === 'car' && !selectedDriver) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Leaf className="h-5 w-5" />
            <span>{loading ? 'Calculating...' : 'Find Eco-Friendly Routes'}</span>
          </button>
        </div>

        {showReview && routeDetails && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Route Review</h3>
            <div className="bg-green-50 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-6">
                <div><Clock className="h-5 w-5 text-green-600" /> {routeDetails.duration} mins</div>
                <div><Ruler className="h-5 w-5 text-green-600" /> {routeDetails.distance} km</div>
                <div><Leaf className="h-5 w-5 text-green-600" /> {routeDetails.carbonSaved} kg CO₂ saved</div>
                {routeDetails.price && (
                  <div className="text-lg font-semibold text-green-600">
                    Total fare: ₹{routeDetails.price}
                  </div>
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
