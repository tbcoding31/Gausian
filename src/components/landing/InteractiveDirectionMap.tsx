import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import * as maplibregl from 'maplibre-gl';
import { ExternalLink } from 'lucide-react';
import {
  ROUTE_A_JALAN_TOL,
  ROUTE_B_JALAN_NASIONAL,
  WAYPOINTS,
  CALLOUT_ANCHORS,
} from '../../data/routeGeoData';
import { landingData } from '../../data/landingData';

// High-quality open editorial style using OpenStreetMap tiles (guaranteed 100% open, zero watermark, zero token required)
const OPEN_EDITORIAL_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
      paint: {
        'raster-saturation': -0.15,
        'raster-contrast': 0.05,
      },
    },
  ],
};

export const InteractiveDirectionMap: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | maplibregl.Map | null>(null);
  const navigate = useNavigate();
  const [, setMapLoaded] = useState(false);
  const [isUsingMapbox, setIsUsingMapbox] = useState(false);

  const envToken = import.meta.env.VITE_MAPBOX_TOKEN;
  const hasValidMapboxToken = Boolean(
    envToken &&
    typeof envToken === 'string' &&
    envToken.trim().startsWith('pk.') &&
    !envToken.includes('your_mapbox') &&
    envToken.trim().length > 25
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map: mapboxgl.Map | maplibregl.Map;
    let MarkerConstructor: typeof mapboxgl.Marker | typeof maplibregl.Marker;

    if (hasValidMapboxToken && envToken) {
      // MODE A: Mapbox GL JS with official Studio Light style
      mapboxgl.accessToken = envToken.trim();
      setIsUsingMapbox(true);

      const mapboxMap = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [106.15, -6.32],
        zoom: 9.0,
        minZoom: 7.0,
        maxZoom: 14,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
      });

      mapboxMap.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-left');
      map = mapboxMap;
      MarkerConstructor = mapboxgl.Marker;
    } else {
      // MODE B: MapLibre GL JS with open raster tiles (no token required, zero telemetry/auth blocks)
      setIsUsingMapbox(false);

      if (maplibregl.config) {
        maplibregl.config.WORKER_URL = '/maplibre-gl-worker.mjs';
      }

      const maplibreMap = new maplibregl.Map({
        container: mapContainerRef.current,
        style: OPEN_EDITORIAL_STYLE,
        center: [106.15, -6.32],
        zoom: 9.0,
        minZoom: 7.0,
        maxZoom: 14,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
      });

      maplibreMap.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');
      map = maplibreMap;
      MarkerConstructor = maplibregl.Marker;
    }

    mapInstanceRef.current = map;

    // Attach layers, route geometry, markers, and callouts on map load
    (map as any).on('load', () => {
      setMapLoaded(true);

      // 1. Add Blue Route (Jalan Tol)
      map.addSource('route-tol-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { name: 'Jalan Tol' },
          geometry: {
            type: 'LineString',
            coordinates: ROUTE_A_JALAN_TOL,
          },
        },
      });

      // Outer glow for toll route
      map.addLayer({
        id: 'route-tol-glow',
        type: 'line',
        source: 'route-tol-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#1D4ED8',
          'line-width': 9,
          'line-opacity': 0.25,
        },
      } as any);

      // Main vector line for toll route
      map.addLayer({
        id: 'route-tol-line',
        type: 'line',
        source: 'route-tol-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#1D4ED8',
          'line-width': 5,
          'line-opacity': 0.95,
        },
      } as any);

      // 2. Add Orange Route (Jalan Nasional)
      map.addSource('route-nasional-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { name: 'Jalan Nasional' },
          geometry: {
            type: 'LineString',
            coordinates: ROUTE_B_JALAN_NASIONAL,
          },
        },
      });

      // Outer glow for national route
      map.addLayer({
        id: 'route-nasional-glow',
        type: 'line',
        source: 'route-nasional-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#D97706',
          'line-width': 9,
          'line-opacity': 0.25,
        },
      } as any);

      // Main dashed line for national route
      map.addLayer({
        id: 'route-nasional-line',
        type: 'line',
        source: 'route-nasional-source',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#D97706',
          'line-width': 5,
          'line-opacity': 0.95,
          'line-dasharray': [2, 1.5],
        },
      } as any);

      // Fit bounds to display the whole route comfortably
      map.fitBounds(
        [
          [105.52, -6.58], // Southwest (Tanjung Lesung area)
          [106.75, -6.08], // Northeast (Soekarno-Hatta area)
        ],
        {
          padding: { top: 50, bottom: 50, left: 60, right: 60 },
          duration: 1000,
          maxZoom: 10.5,
        }
      );

      // 3. Mount Geographically Anchored Markers
      const airportEl = createMarkerElement('airport');
      new (MarkerConstructor as any)({ element: airportEl, anchor: 'center' })
        .setLngLat(WAYPOINTS.airport.coordinates)
        .addTo(map);

      const tollEl = createMarkerElement('toll');
      new (MarkerConstructor as any)({ element: tollEl, anchor: 'center' })
        .setLngLat(WAYPOINTS.tollGate.coordinates)
        .addTo(map);

      const destEl = createMarkerElement('destination');
      new (MarkerConstructor as any)({ element: destEl, anchor: 'center' })
        .setLngLat(WAYPOINTS.destination.coordinates)
        .addTo(map);

      // 4. Mount Geographically Anchored Callouts
      const calloutTolEl = createCalloutElement('tol');
      new (MarkerConstructor as any)({ element: calloutTolEl, anchor: 'bottom' })
        .setLngLat(CALLOUT_ANCHORS.jalanTol)
        .addTo(map);

      const calloutNasionalEl = createCalloutElement('nasional');
      new (MarkerConstructor as any)({ element: calloutNasionalEl, anchor: 'bottom' })
        .setLngLat(CALLOUT_ANCHORS.jalanNasional)
        .addTo(map);
    });

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserver.observe(mapContainerRef.current);

    // Unmount cleanup: free WebGL context
    return () => {
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [hasValidMapboxToken, envToken]);

  // Marker HTML generators
  function createMarkerElement(type: 'airport' | 'toll' | 'destination'): HTMLElement {
    const el = document.createElement('div');
    el.className = 'cursor-pointer select-none';

    if (type === 'airport') {
      el.innerHTML = `
        <div class="flex items-center gap-1.5 group">
          <div class="w-8 h-8 rounded-full bg-[#1E40AF] text-white flex items-center justify-center shadow-md ring-2 ring-white">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"/>
            </svg>
          </div>
          <span class="text-[11px] font-bold text-gray-800 bg-white/90 px-2 py-0.5 rounded shadow-sm hidden md:inline">
            Soekarno-Hatta
          </span>
        </div>
      `;
    } else if (type === 'toll') {
      el.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-[#D97706] text-white flex items-center justify-center shadow-md ring-2 ring-white">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="16" height="16" x="4" y="4" rx="2"/>
            <path d="M9 9h6"/>
            <path d="M9 15h6"/>
          </svg>
        </div>
      `;
    } else if (type === 'destination') {
      el.innerHTML = `
        <div class="relative flex flex-col items-center group">
          <!-- Concentric Ripple Circles -->
          <div class="relative flex items-center justify-center w-9 h-9">
            <span class="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping"></span>
            <span class="relative inline-flex rounded-full h-8 w-8 bg-[#D97706] border-2 border-white items-center justify-center text-white shadow-lg">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2"/>
                <path d="M12 20v2"/>
                <path d="m4.93 4.93 1.41 1.41"/>
                <path d="m17.66 17.66 1.41 1.41"/>
                <path d="M2 12h2"/>
                <path d="M20 12h2"/>
                <path d="m6.34 17.66-1.41 1.41"/>
                <path d="m19.07 4.93-1.41 1.41"/>
              </svg>
            </span>
          </div>
          <div class="mt-1 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold tracking-tight whitespace-nowrap shadow-md">
            Lesung Beach, Banten
          </div>
        </div>
      `;
    }
    return el;
  }

  // Callout HTML generators
  function createCalloutElement(type: 'tol' | 'nasional'): HTMLElement {
    const el = document.createElement('div');
    el.className = 'select-none transition-transform hover:scale-105';

    if (type === 'tol') {
      el.innerHTML = `
        <div class="relative w-56 md:w-64 bg-[#1E3A8A] text-white p-3.5 rounded-xl shadow-xl border border-white/10">
          <div class="flex items-center justify-between mb-1">
            <span class="font-extrabold text-xs md:text-sm tracking-tight">Jalan Tol</span>
            <span class="text-blue-200 text-xs">🚗</span>
          </div>
          <div class="text-[11px] text-blue-200 font-semibold mb-1">1 Jam 30 Menit</div>
          <p class="text-[10px] md:text-[11px] text-blue-50/90 leading-tight">
            Bandara Soekarno-Hatta, Menuju Gerbang toll Rangkasbitung
          </p>
          <!-- Downward pointer arrow -->
          <div class="absolute -bottom-2 left-8 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#1E3A8A]"></div>
        </div>
      `;
    } else {
      el.innerHTML = `
        <div class="relative w-56 md:w-64 bg-[#B45309] text-white p-3.5 rounded-xl shadow-xl border border-white/10">
          <div class="flex items-center justify-between mb-1">
            <span class="font-extrabold text-xs md:text-sm tracking-tight">Jalan Nasional</span>
            <span class="text-amber-200 text-xs">🛣️</span>
          </div>
          <div class="text-[11px] text-amber-200 font-semibold mb-1">2 Jam 40 Menit</div>
          <p class="text-[10px] md:text-[11px] text-amber-50/90 leading-tight">
            Gerbang toll Rangkasbitung, Menuju Tanjung Lesung
          </p>
          <!-- Downward pointer arrow -->
          <div class="absolute -bottom-2 left-8 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#B45309]"></div>
        </div>
      `;
    }
    return el;
  }

  const handleStartVirtualTour = () => {
    navigate('/virtual-tour/loading');
  };

  return (
    <div className="relative w-full h-[440px] md:h-[500px] lg:h-[540px] rounded-none md:rounded-l-xl overflow-hidden border-t border-b md:border-l border-black/[0.08] shadow-[0_6px_24px_rgba(0,0,0,0.05)] bg-[#E8F1F2]">
      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Engine Status Badge */}
      <div className="absolute top-3 right-3 z-30 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm border border-black/10 shadow-sm text-[10px] text-gray-600 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>{isUsingMapbox ? 'Mapbox GL JS (Vector)' : 'OpenStreetMap (MapLibre GL)'}</span>
        {!isUsingMapbox && (
          <>
            <span className="text-gray-400">|</span>
            <span className="text-[9px] text-gray-500 font-mono">Real Basemap Active</span>
          </>
        )}
      </div>

      {/* Floating CTA Overlay: See Virtual Tour */}
      <div className="absolute left-4 md:left-8 bottom-6 z-30 flex items-center pointer-events-auto">
        <button
          onClick={handleStartVirtualTour}
          type="button"
          aria-label="See Virtual Tour"
          className="group flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-black/[0.08] hover:border-black/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {/* 4-way expand compass icon */}
          <div className="w-7 h-7 rounded-lg bg-[#111318] text-white flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              3D Virtual Tour
            </div>
            <div className="text-xs md:text-sm font-extrabold text-[#111318] leading-tight">
              See Virtual Tour →
            </div>
          </div>
        </button>
      </div>

      {/* Floating Google Maps Control in Bottom Right */}
      <div className="absolute right-3 md:right-5 bottom-4 z-30">
        <a
          href={landingData.directionMap.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buka rute di Google Maps"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-800 text-xs font-semibold shadow-md border border-black/10 backdrop-blur-sm transition-all hover:scale-105"
        >
          <span>Lihat di google maps</span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-600" />
        </a>
      </div>
    </div>
  );
};
