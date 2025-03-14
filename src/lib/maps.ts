import { Loader } from '@googlemaps/js-api-loader';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
  libraries: ['places', 'routes']
});

export const calculateRoute = async (
  origin: string,
  destination: string,
  mode: google.maps.TravelMode
): Promise<{
  distance: number;
  duration: number;
  route: google.maps.DirectionsResult;
}> => {
  const google = await loader.load();
  const directionsService = new google.maps.DirectionsService();

  try {
    const result = await directionsService.route({
      origin,
      destination,
      travelMode: mode,
    });

    const distance = result.routes[0].legs[0]?.distance?.value || 0;
    const duration = result.routes[0].legs[0]?.duration?.value || 0;

    return {
      distance: distance / 1000, // Convert to kilometers
      duration: duration / 60, // Convert to minutes
      route: result,
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    throw new Error('Failed to calculate route');
  }
};