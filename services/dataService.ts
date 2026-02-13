
import { Donor, BloodRequest } from '../types';

/**
 * Backend API URL (Connect your Node.js/Express/MongoDB server here)
 */
const API_URL = 'http://localhost:5000/api'; 

const DONORS_KEY = 'bbbd_donors';
const REQUESTS_KEY = 'bbbd_requests';

export const dataService = {
  // (Health Check) database
  checkConnection: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3 seconds timeout
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  // for all database list
  getDonors: async (): Promise<Donor[]> => {
    try {
      const res = await fetch(`${API_URL}/donors`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (error) {
      console.warn("Backend offline or error, using local storage fallback");
      const stored = localStorage.getItem(DONORS_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  },

  // for new donor registration 
  saveDonor: async (donorData: Omit<Donor, 'id' | 'status'>): Promise<Donor> => {
    try {
      const res = await fetch(`${API_URL}/donors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donorData)
      });
      if (!res.ok) throw new Error('Failed to save to MongoDB');
      return await res.json();
    } catch (error) {
      // Fallback: LocalStorage into saved
      const donors = await dataService.getDonors();
      const newDonor: Donor = {
        ...donorData,
        id: `D-${Math.floor(Math.random() * 90000) + 10000}`,
        status: 'active'
      };
      const updatedDonors = [newDonor, ...donors];
      localStorage.setItem(DONORS_KEY, JSON.stringify(updatedDonors));
      return newDonor;
    }
  },

  // for all blood requests 
  getRequests: async (): Promise<BloodRequest[]> => {
    try {
      const res = await fetch(`${API_URL}/requests`);
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (error) {
      const stored = localStorage.getItem(REQUESTS_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  },

  // for new blood requests  submitted 
  saveRequest: async (requestData: Omit<BloodRequest, 'id' | 'status' | 'requestedDate'>): Promise<BloodRequest> => {
    try {
      const res = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      if (!res.ok) throw new Error('Failed to save request');
      return await res.json();
    } catch (error) {
      const requests = await dataService.getRequests();
      const newRequest: BloodRequest = {
        ...requestData,
        id: `REQ-${Math.floor(Math.random() * 90000) + 10000}`,
        status: 'pending',
        requestedDate: new Date().toISOString()
      };
      const updatedRequests = [newRequest, ...requests];
      localStorage.setItem(REQUESTS_KEY, JSON.stringify(updatedRequests));
      return newRequest;
    }
  },

  // database (Stats) calculations 
  getStats: async () => {
    const donors = await dataService.getDonors();
    const requests = await dataService.getRequests();
    
    return {
      totalDonors: donors.length,
      pendingRequests: requests.filter(r => r.status === 'pending').length,
      successfulDonations: Math.floor(donors.length * 1.5), // its a demo calculations 
      };
  }
};
