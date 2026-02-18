/**
 * useAQI.ts
 *
 * Custom hook that encapsulates all AQI (Air Quality Index) logic:
 *   - Browser geolocation with permission checks
 *   - IP-based geolocation fallback
 *   - WAQI API fetching with auto-refresh (10 min)
 *
 * Returns { aqiState, fetchAQI } for consumers.
 */

import { useState, useCallback, useEffect } from 'react';
import type { AQIData, AQIState } from '../config/aqiHelpers';

export const useAQI = () => {
  const [aqiState, setAqiState] = useState<AQIState>({
    data: null,
    loading: true,
    error: null,
  });

  // ── Browser geolocation ──────────────────────────────────────────────
  const getUserLocation = useCallback((): Promise<{ lat: number; lon: number }> => {
    return new Promise(async (resolve, reject) => {
      if (!navigator.geolocation) {
        console.error('Geolocation not supported by browser');
        reject(new Error('Geolocation not supported'));
        return;
      }

      if (window.isSecureContext === false) {
        console.error('Geolocation requires HTTPS');
        reject(new Error('Geolocation requires secure context (HTTPS)'));
        return;
      }

      if ('permissions' in navigator) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          console.log('Geolocation permission status:', permissionStatus.state);
          if (permissionStatus.state === 'denied') {
            reject(new Error('Location permission denied'));
            return;
          }
        } catch {
          console.log('Permission API not available, proceeding with geolocation request');
        }
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          console.log('Browser Geolocation - LAT:', lat, 'LON:', lon);
          resolve({ lat, lon });
        },
        (err) => {
          console.error('Location error:', err.message, 'Code:', err.code);
          let errorMsg = 'Location access failed';
          if (err.code === 1) errorMsg = 'Location permission denied';
          else if (err.code === 2) errorMsg = 'Location unavailable';
          else if (err.code === 3) errorMsg = 'Location request timeout';
          reject(new Error(errorMsg));
        },
        {
          timeout: 20000,
          enableHighAccuracy: false,
          maximumAge: 300000,
        },
      );
    });
  }, []);

  // ── IP-based fallback ────────────────────────────────────────────────
  const getLocationFromIP = useCallback(async (): Promise<{ lat: number; lon: number }> => {
    console.log('Falling back to IP-based location...');

    const services = [
      { url: 'https://ipapi.co/json/', parse: (d: any) => ({ lat: d.latitude, lon: d.longitude }) },
      { url: 'https://ipwho.is/', parse: (d: any) => ({ lat: d.latitude, lon: d.longitude }) },
      {
        url: 'https://api.ipify.org?format=json',
        parse: async (d: any) => {
          const ipRes = await fetch(`https://ipapi.co/${d.ip}/json/`, {
            headers: { Accept: 'application/json' },
            signal: AbortSignal.timeout(10000), // Using target browser support or polyfill if needed
          });
          
          if (!ipRes.ok) {
              throw new Error(`IP Geo Service failed: ${ipRes.status} ${ipRes.statusText}`);
          }
          
          const ipData = await ipRes.json();
          return { lat: ipData.latitude, lon: ipData.longitude };
        },
      },
    ];

    for (const service of services) {
      try {
        console.log(`Trying IP service: ${service.url}`);
        const res = await fetch(service.url, {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(10000),
        });

        if (!res.ok) {
          console.warn(`IP service ${service.url} returned ${res.status}`);
          continue;
        }

        const data = await res.json();
        const coords = typeof service.parse === 'function' ? await service.parse(data) : service.parse;

        if (coords.lat != null && coords.lon != null) return coords;
      } catch (err) {
        console.warn(`IP service ${service.url} failed:`, err);
        continue;
      }
    }

    throw new Error('All IP geolocation services failed');
  }, []);

  // ── Fetch AQI with coords ───────────────────────────────────────────
  const fetchAQIWithCoords = useCallback(async (lat: number, lon: number): Promise<AQIData> => {
    const token = import.meta.env.VITE_WAQI_API_TOKEN;
    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`;

    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`AQI API request failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (data.status === 'ok' && data.data) {
      return {
        aqi: data.data.aqi,
        station: data.data.city?.name || 'Unknown Location',
        dominantPollutant: data.data.dominentpol || 'N/A',
        lastUpdated: data.data.time?.s || new Date().toISOString(),
      };
    }
    
    // Explicitly check for non-null/undefined data object to avoid "undefined" strings in error
    const errorMessage = typeof data.data === 'string'
      ? data.data
      : (data.data !== null && data.data !== undefined) 
          ? JSON.stringify(data.data) 
          : (data.message || res.statusText || 'Failed to fetch AQI data');
    throw new Error(errorMessage);
  }, []);

  // ── Main fetch orchestrator ──────────────────────────────────────────
  const fetchAQI = useCallback(async () => {
    setAqiState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      let coords: { lat: number; lon: number };
      let locationSource = 'unknown';

      try {
        console.log('Attempting browser geolocation...');
        coords = await getUserLocation();
        locationSource = 'browser';
        console.log('✓ Using browser geolocation');
      } catch (geoError) {
        console.log('Geolocation failed, falling back to IP location:', geoError);
        try {
          coords = await getLocationFromIP();
          locationSource = 'ip';
          console.log('✓ Using IP-based location');
        } catch (ipError) {
          console.error('Both geolocation methods failed:', ipError);
          throw new Error('Unable to determine location. Please enable location access or check your internet connection.');
        }
      }

      console.log(`Fetching AQI for coordinates from ${locationSource}:`, coords);
      const aqiData = await fetchAQIWithCoords(coords.lat, coords.lon);
      setAqiState({ data: aqiData, loading: false, error: null });
    } catch (err) {
      console.error('AQI fetch failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unable to fetch air quality data. Please try again.';
      setAqiState({ data: null, loading: false, error: errorMessage });
    }
  }, [getUserLocation, getLocationFromIP, fetchAQIWithCoords]);

  // ── Auto-refresh every 10 minutes ────────────────────────────────────
  useEffect(() => {
    fetchAQI();
    const interval = setInterval(fetchAQI, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAQI]);

  return { aqiState, fetchAQI };
};
