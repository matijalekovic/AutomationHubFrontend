
import { AutomationRequest } from '../types';
import { db } from '../db';

export const getRequests = async (): Promise<AutomationRequest[]> => {
  // Return all requests sorted by creation date (descending)
  return await db.requests.orderBy('createdAt').reverse().toArray();
};

export const createRequest = async (request: AutomationRequest): Promise<void> => {
  await db.requests.add(request);
};

export const saveRequest = async (request: AutomationRequest): Promise<void> => {
    await db.requests.put(request);
};

export const deleteRequest = async (id: string): Promise<void> => {
  await db.requests.delete(id);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
