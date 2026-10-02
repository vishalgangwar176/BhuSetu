import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Parcel, NearbyPlace } from '../../types';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Sparkles, 
  Building2, 
  RefreshCw, 
  Compass, 
  Layers,
  GraduationCap,
  Hospital,
  Train,
  TreePine
} from 'lucide-react';

interface NearbyContextProps {
  parcel: Parcel;
}

export const NearbyContextDrawer: React.FC<NearbyContextProps> = ({ parcel }) => {
  const { fetchNearbyContext, nearbyPlaces, showToast } = useApp();

  const [loading, setLoading] = useState<boolean>(false);
  const [contextData, setContextData] = useState<{
    text: string;
    places: NearbyPlace[];
    sourceAttribution: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadContext = async () => {
      setLoading(true);
      try {
        const [lat, lng] = parcel.center || [12.9716, 77.6412];
        const res = await fetchNearbyContext(lat, lng, parcel);
        if (isMounted) {
          setContextData(res);
        }
      } catch (err) {
        console.warn("Failed to load nearby context", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadContext();
    return () => { isMounted = false; };
  }, [parcel.id]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Hospital': return Hospital;
      case 'School': return GraduationCap;
      case 'Metro / Transit': return Train;
      case 'Park / Civic': return TreePine;
      default: return Building2;
    }
  };

  const handleNavigateGoogleMaps = () => {
    const [lat, lng] = parcel.center || [12.9716, 77.6412];
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
    showToast("Navigation Dispatched", "Opening Google Maps turn-by-turn directions.", "info");
  };

  return (
    <div className="space-y-3 pt-3 border-t border-[#D5D9DE] dark:border-[#2F343A]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-[2px] bg-[#E9ECF0] dark:bg-[#22262B] text-[#1F4E8C] dark:text-[#7FB0E8] flex items-center justify-center border border-[#D5D9DE] dark:border-[#2F343A]">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-semibold text-[#1B1F23] dark:text-[#E8EAED]">
            Nearby Civic Landmarks
          </h4>
        </div>

        <button
          onClick={handleNavigateGoogleMaps}
          className="px-2.5 py-1 text-[11px] font-semibold rounded-[4px] bg-[#1F4E8C] dark:bg-[#3F7CC4] hover:opacity-95 text-white flex items-center gap-1 transition-opacity cursor-pointer"
          title="Open Directions in Google Maps"
        >
          <Navigation className="w-3 h-3" />
          <span>Directions</span>
        </button>
      </div>

      {loading ? (
        <div className="p-3 rounded-[4px] bg-[#F4F5F7] dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] space-y-2">
          <div className="h-2.5 bg-[#D5D9DE] dark:bg-[#2F343A] rounded-[2px] w-full animate-pulse" />
          <div className="h-2.5 bg-[#D5D9DE] dark:bg-[#2F343A] rounded-[2px] w-4/5 animate-pulse" />
        </div>
      ) : (
        <div className="space-y-2.5">
          {contextData && (
            <p className="text-[11px] text-[#4A5568] dark:text-[#AEB4BB] leading-relaxed">
              {contextData.text}
            </p>
          )}

          {/* Place Cards */}
          <div className="grid grid-cols-1 gap-2">
            {(contextData?.places || nearbyPlaces).slice(0, 4).map((p) => {
              const Icon = getCategoryIcon(p.category);
              return (
                <div
                  key={p.id}
                  className="p-2.5 rounded-[4px] bg-[#F4F5F7] dark:bg-[#22262B] border border-[#D5D9DE] dark:border-[#2F343A] flex items-start justify-between gap-2"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-[2px] bg-white dark:bg-[#1A1D21] text-[#718096] dark:text-[#AEB4BB] flex items-center justify-center shrink-0 border border-[#D5D9DE] dark:border-[#2F343A] mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#1B1F23] dark:text-[#E8EAED] text-xs block leading-tight">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-[#718096] dark:text-[#7D858E] block">
                        {p.address}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-1.5 py-0.5 border border-[#D5D9DE] dark:border-[#2F343A] text-[#4A5568] dark:text-[#AEB4BB] rounded-[2px] shrink-0">
                    {p.distanceMeters ? `${p.distanceMeters}m` : 'Nearby'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#718096] dark:text-[#7D858E] pt-1">
            <span>Source: Public Location Data</span>
            <span className="italic">NAKSHA Spatial Verification</span>
          </div>
        </div>
      )}
    </div>
  );
};
