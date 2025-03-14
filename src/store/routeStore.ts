import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface Route {
  id: string;
  userId: string;
  startLocation: Location;
  endLocation: Location;
  transportMode: string;
  distance: number;
  duration: number;
  carbonSaved: number;
  createdAt: string;
}

interface RouteState {
  routes: Route[];
  loading: boolean;
  error: string | null;
  saveRoute: (route: Omit<Route, 'id' | 'createdAt'>) => Promise<void>;
  getUserRoutes: () => Promise<void>;
}

export const useRouteStore = create<RouteState>((set) => ({
  routes: [],
  loading: false,
  error: null,

  saveRoute: async (route) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('routes')
        .insert([{
          user_id: route.userId,
          start_location: route.startLocation,
          end_location: route.endLocation,
          transport_mode: route.transportMode,
          distance: route.distance,
          carbon_footprint: route.carbonSaved,
          eco_points_earned: Math.floor(route.carbonSaved * 10),
          journey_date: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        routes: [...state.routes, data as unknown as Route],
        loading: false
      }));

      toast.success('Route saved successfully!');
    } catch (error) {
      console.error('Error saving route:', error);
      set({ error: 'Failed to save route', loading: false });
      toast.error('Failed to save route');
    }
  },

  getUserRoutes: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        set({ loading: false });
        return;
      }

      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ routes: data as unknown as Route[], loading: false });
    } catch (error) {
      console.error('Error fetching routes:', error);
      set({ error: 'Failed to fetch routes', loading: false });
    }
  },
}));