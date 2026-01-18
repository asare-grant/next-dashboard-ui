// utils/delivery.ts
import { STORE_LOCATION } from "@/config/store";

const toRad = (v: number) => (v * Math.PI) / 180;

export const calculateDistanceKm = (
  lat: number,
  lon: number
): number => {
  const R = 6371;
  const dLat = toRad(lat - STORE_LOCATION.latitude);
  const dLon = toRad(lon - STORE_LOCATION.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(STORE_LOCATION.latitude)) *
      Math.cos(toRad(lat)) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

export const calculateDeliveryFee = (distanceKm: number) => {
  const BASE_FEE = 10; // GHS
  const PER_KM = 3; // GHS

  return Math.round(BASE_FEE + distanceKm * PER_KM);
};
