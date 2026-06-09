import React, { useEffect, useState } from 'react';
import { Compass, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import axiosInstance from '../helpers/axios-instance';
import { Destination } from '../types';
import { useAuth } from '../hooks/useAuth';
import DestinationCard from '../components/destination-card';

import { INDIAN_STATES_AND_UTS } from '../constants/states';

export const Destinations: React.FC = () => {
  const { user } = useAuth();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [description, setDescription] = useState('');
  const [bestSeason, setBestSeason] = useState('');
  const [lat, setLat] = useState('20.5937');
  const [lng, setLng] = useState('78.9629');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/destinations');
      if (res.data.success) {
        setDestinations(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const handleAddDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !state || !city || !coverImage || !description || !bestSeason) {
      setFormError('Please fill in all fields');
      return;
    }

    try {
      setFormError('');
      setFormSuccess('');
      setSubmitting(true);
      const res = await axiosInstance.post('/destinations', {
        name,
        state,
        city,
        coverImage,
        description,
        bestSeason,
        coordinates: {
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        },
      });

      if (res.data.success) {
        setFormSuccess('Destination added successfully!');
        setName('');
        setState('');
        setCity('');
        setCoverImage('');
        setDescription('');
        setBestSeason('');
        await fetchDestinations();
        setTimeout(() => {
          setShowAddForm(false);
          setFormSuccess('');
        }, 1500);
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to add destination');
    } finally {
      setSubmitting(false);
    }
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <Compass className="w-8 h-8 text-brand-500" />
              Explore Curated Destinations
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
              Select one to view itineraries, ratings, and blogs created for that region.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Destination
            </button>
          )}
        </div>

        {showAddForm && isAdmin && (
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm mb-10">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-slate-100">Add New Destination</h2>
            {formError && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            {formSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddDestination} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">Destination Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alleppey Backwaters"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Alleppey"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">State</label>
                  <select
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
                  >
                    <option value="">Select State/UT</option>
                    {INDIAN_STATES_AND_UTS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">Cover Image URL</label>
                  <input
                    type="text"
                    required
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="e.g. https://images.unsplash.com/photo..."
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">Best Season to Visit</label>
                  <input
                    type="text"
                    required
                    value={bestSeason}
                    onChange={(e) => setBestSeason(e.target.value)}
                    placeholder="e.g. October to March"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">Latitude</label>
                  <input
                    type="text"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="20.5937"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">Longitude</label>
                  <input
                    type="text"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="78.9629"
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize key features, history, or culture..."
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Destination'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="h-80 rounded-2xl bg-gray-200 dark:bg-slate-800" />
            <div className="h-80 rounded-2xl bg-gray-200 dark:bg-slate-800" />
            <div className="h-80 rounded-2xl bg-gray-200 dark:bg-slate-800" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <DestinationCard key={destination._id} destination={destination} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Destinations;
