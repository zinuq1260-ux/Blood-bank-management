import React, { useState } from 'react';
import { User, MapPin, Activity, ChevronRight, ChevronLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { BloodGroup } from '../types';

interface RegistrationViewProps {
  onComplete: () => void;
}

const RegistrationView: React.FC<RegistrationViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    division: '',
    district: '',
    bloodGroup: '' as BloodGroup,
    weight: '',
    lastDonation: ''
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dataService.saveDonor({
        fullName: formData.fullName,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        location: `${formData.district}, ${formData.division}`,
      });
      onComplete();
    } catch (err) {
      alert("Error connecting to database. Please check your backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { icon: <User size={20} />, label: 'Personal' },
    { icon: <MapPin size={20} />, label: 'Contact' },
    { icon: <Activity size={20} />, label: 'Medical' },
    { icon: <CheckCircle2 size={20} />, label: 'Verify' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-black text-slate-900 mb-4">Donor Registration</h1>
          <p className="text-slate-500 max-w-lg mx-auto">Your information will be securely stored in our central database.</p>
        </div>

        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          {steps.map((s, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= idx + 1 ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-200' : 'bg-white border-slate-200 text-slate-400'
              }`}>
                {s.icon}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${
                step >= idx + 1 ? 'text-red-600' : 'text-slate-400'
              }`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 p-8 sm:p-12 border border-slate-100">
          <form onSubmit={handleFinalSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-8">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-red-600 transition-all outline-none" placeholder="Enter Full Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Date of Birth</label>
                    <input type="date" name="dob" required value={formData.dob} onChange={handleChange} className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 focus:bg-white focus:border-red-600 transition-all outline-none" />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                  <CheckCircle2 size={64} />
                </div>
                <h3 className="text-3xl font-bold mb-4">Final Submission</h3>
                <p className="text-slate-500 mb-10">Data will be transmitted to the secure MongoDB cluster.</p>
              </div>
            )}

            <div className="mt-12 flex flex-col-reverse sm:flex-row justify-between gap-4">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="px-10 py-5 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                  <ChevronLeft size={20} /> Back
                </button>
              )}
              {step < 4 ? (
                <button type="button" onClick={nextStep} className="sm:ml-auto px-10 py-5 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-2">
                  Continue <ChevronRight size={20} />
                </button>
              ) : (
                <button 
                  type="submit" disabled={isSubmitting}
                  className="sm:ml-auto px-16 py-5 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-100 disabled:opacity-50 flex items-center gap-3"
                >
                  {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Connecting to DB...</> : "Confirm Registration"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationView;
