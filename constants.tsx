
import React from 'react';
import { Droplets, Users, Heart, Hospital, Activity, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { BloodGroup } from './types';

export const BLOOD_GROUPS: { type: BloodGroup; count: string }[] = [
  { type: 'A+', count: '12' },
  { type: 'A-', count: '20' },
  { type: 'B+', count: '30' },
  { type: 'B-', count: '8' },
  { type: 'O+', count: '18' },
  { type: 'O-', count: '19' },
  { type: 'AB+', count: '15' },
  { type: 'AB-', count: '2' },
];

export const STATS = [
  { icon: <Users size={24} />, label: 'Active Donors', value: '1K+' },
  { icon: <Heart size={24} />, label: 'Lives Saved', value: '500+' },
  { icon: <MapPin size={24} />, label: 'Districts', value: '64' },
];

export const DASHBOARD_STATS = [
  { icon: <Users />, label: 'Total Donors', value: '1002', change: '+12.5%', color: 'text-red-600', bg: 'bg-red-50' },
  { icon: <Clock />, label: 'Pending Requests', value: '24', change: '-3 from yesterday', color: 'text-orange-600', bg: 'bg-orange-50' },
  { icon: <ShieldCheck />, label: 'Successful Donations', value: '620', change: '+8.3%', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: <Hospital />, label: 'Partner Hospitals', value: '5', change: '+5 new', color: 'text-blue-600', bg: 'bg-blue-50' },
];
