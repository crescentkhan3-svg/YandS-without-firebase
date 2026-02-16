export const uploadImage = async (file: File | Blob, path: string): Promise<string> => {
  return URL.createObjectURL(file);
};

export const uploadBase64Image = async (base64String: string, path: string): Promise<string> => {
  return base64String;
};

export const deleteImage = async (path: string): Promise<void> => {
  return;
};

export const getVehicleImagePath = (vehicleId: string, fileName: string = 'image.jpg'): string => {
  return `vehicles/${vehicleId}_${fileName}`;
};

export const getRentalImagePath = (rentalId: string, imageType: string): string => {
  return `rentals/${rentalId}/${imageType}.jpg`;
};
