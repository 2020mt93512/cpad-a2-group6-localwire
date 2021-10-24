import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import * as geofire from 'geofire-common';

const platform = Capacitor.getPlatform();

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export const getLocation = async (): Promise<LocationCoords> => {
  if (platform === 'web') {
    if (!navigator.geolocation) {
      console.error('Permission Denied, loading default location.');
      // palo alto
      return { latitude: 37.4419, longitude: -122.143 };
    } else {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (coords) => {
            resolve({
              latitude: coords.coords.latitude,
              longitude: coords.coords.longitude,
            });
          },
          () => {
            console.error('Permission Denied, loading default location.');
            // palo alto
            reject({ latitude: 37.4419, longitude: -122.143 });
          }
        );
      });
    }
  }

  const permission = await Geolocation.checkPermissions();
  const options = {
    enableHighAccuracy: true,
    timeout: 50000,
    maximumAge: Infinity,
  };

  if (permission.location === 'granted') {
    const coordinates = await Geolocation.getCurrentPosition(options);
    return {
      latitude: coordinates.coords.latitude,
      longitude: coordinates.coords.longitude,
    };
  } else {
    await Geolocation.requestPermissions();
    const coordinates = await Geolocation.getCurrentPosition(options);
    return {
      latitude: coordinates.coords.latitude,
      longitude: coordinates.coords.longitude,
    };
  }
};

export const getGeohashForLocationCoords = (location: LocationCoords): string =>
  geofire.geohashForLocation([location.latitude, location.longitude]);

export const getGeohashQueryBounds = (center: LocationCoords, radiusInM: number = 10 * 1000): string[][] =>
  geofire.geohashQueryBounds([center.latitude, center.longitude], radiusInM);

export const distanceBetween = (location: LocationCoords, center: LocationCoords): number =>
  geofire.distanceBetween([location.latitude, location.longitude], [center.latitude, center.longitude]);

export const filterFalsePositiveGeoHash = (
  location: LocationCoords,
  center: LocationCoords,
  radiusInM: number
): boolean => distanceBetween(location, center) * 1000 <= radiusInM;
