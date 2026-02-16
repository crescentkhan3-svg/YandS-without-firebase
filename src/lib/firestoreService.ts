import { Rental, Vehicle } from '@/types/rental';

const getStoredData = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const setStoredData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const subscribeToRentals = (callback: (rentals: Rental[]) => void) => {
  const rentals = getStoredData('rentals') || [];
  callback(rentals);
  return () => {};
};

export const addRentalToFirestore = async (rental: Omit<Rental, 'id'>): Promise<string> => {
  const rentals = getStoredData('rentals') || [];
  const id = Math.random().toString(36).substr(2, 9);
  const newRental = { ...rental, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  setStoredData('rentals', [...rentals, newRental]);
  return id;
};

export const updateRentalInFirestore = async (id: string, rental: Partial<Rental>): Promise<void> => {
  const rentals = getStoredData('rentals') || [];
  const updatedRentals = rentals.map((r: any) => r.id === id ? { ...r, ...rental, updatedAt: new Date().toISOString() } : r);
  setStoredData('rentals', updatedRentals);
};

export const deleteRentalFromFirestore = async (id: string): Promise<void> => {
  const rentals = getStoredData('rentals') || [];
  setStoredData('rentals', rentals.filter((r: any) => r.id !== id));
};

export const subscribeToVehicles = (callback: (vehicles: Vehicle[]) => void) => {
  const vehicles = getStoredData('vehicles') || [];
  callback(vehicles);
  return () => {};
};

export const addVehicleToFirestore = async (vehicle: Omit<Vehicle, 'id'>): Promise<string> => {
  const vehicles = getStoredData('vehicles') || [];
  const id = Math.random().toString(36).substr(2, 9);
  const newVehicle = { ...vehicle, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  setStoredData('vehicles', [...vehicles, newVehicle]);
  return id;
};

export const updateVehicleInFirestore = async (id: string, vehicle: Partial<Vehicle>): Promise<void> => {
  const vehicles = getStoredData('vehicles') || [];
  const updatedVehicles = vehicles.map((v: any) => v.id === id ? { ...v, ...vehicle, updatedAt: new Date().toISOString() } : v);
  setStoredData('vehicles', updatedVehicles);
};

export const deleteVehicleFromFirestore = async (id: string): Promise<void> => {
  const vehicles = getStoredData('vehicles') || [];
  setStoredData('vehicles', vehicles.filter((v: any) => v.id !== id));
};

export const getRentalsOnce = async (): Promise<Rental[]> => getStoredData('rentals') || [];
export const getVehiclesOnce = async (): Promise<Vehicle[]> => getStoredData('vehicles') || [];
