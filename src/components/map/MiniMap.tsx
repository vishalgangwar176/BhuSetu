import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';

interface MiniMapProps {
  height?: string;
  focusPoint?: [number, number];
  center?: [number, number] | number[];
  zoom?: number;
  highlightParcelId?: string;
  markerTitle?: string;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  height = '240px',
  focusPoint = [12.9716, 77.6412],
  center,
  zoom = 15,
  highlightParcelId,
  markerTitle
}) => {
  const effectiveCenter: [number, number] = (center && center.length >= 2) 
    ? [center[0], center[1]] 
    : focusPoint;
  const { parcels, isDarkMode } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: effectiveCenter,
      zoom: zoom,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false
    });

    const tileUrl = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 18
    }).addTo(map);

    parcels.forEach((parcel) => {
      const isTarget = highlightParcelId === parcel.id;
      let color = parcel.status === 'verified' ? '#10B981' : parcel.status === 'conflict' ? '#F43F5E' : '#F59E0B';
      if (isTarget) color = isDarkMode ? '#4C8DFF' : '#0B2545';

      L.polygon(parcel.coordinates, {
        color: color,
        weight: isTarget ? 3 : 1,
        fillColor: color,
        fillOpacity: isTarget ? 0.8 : 0.4
      }).addTo(map);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [parcels, focusPoint, zoom, highlightParcelId, isDarkMode]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height }} 
      className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner relative z-0" 
    />
  );
};
