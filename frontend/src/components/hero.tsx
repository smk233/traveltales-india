import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { INDIAN_STATES_AND_UTS } from '../constants/states';

const ALL_STATES = ['All', ...INDIAN_STATES_AND_UTS];

interface HeroProps {
  onSearch: (query: string) => void;
  onFilterState: (state: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onFilterState }) => {
  const [query, setQuery] = useState('');
  const [activeState, setActiveState] = useState('All');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleStateClick = (state: string) => {
    setActiveState(state);
    onFilterState(state);
  };

  return (
    <div className="relative bg-slate-900 text-white overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1600&auto=format&fit=crop"
          alt="Taj Mahal India"
          className="w-full h-full object-cover opacity-35 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 leading-none">
          Discover India's <span className="bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400 bg-clip-text text-transparent">Untold Stories</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8 font-light">
          Explore authentic vlogs and travel tales compiled by explorers from Kashmir to Kanyakumari.
        </p>

        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center bg-white dark:bg-slate-800 rounded-full shadow-lg max-w-2xl mx-auto p-1.5 border border-gray-100 dark:border-slate-700 mb-10"
        >
          <div className="flex items-center gap-2 pl-4 flex-grow text-gray-400">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search destinations, states, or tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-slate-200 text-sm py-2"
            />
          </div>
          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-all cursor-pointer"
          >
            Search
          </button>
        </form>

        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wider block mb-3 font-semibold flex items-center justify-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Filter by State
          </span>
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-3 px-4 max-w-4xl mx-auto scrollbar-none snap-x whitespace-nowrap justify-start md:justify-center">
            {ALL_STATES.map((state) => (
              <button
                key={state}
                onClick={() => handleStateClick(state)}
                className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all cursor-pointer shrink-0 snap-center ${activeState === state
                    ? 'bg-brand-500 border-brand-500 text-white shadow-sm'
                    : 'bg-slate-800/40 border-slate-700 text-gray-300 hover:bg-slate-700/60 hover:text-white'
                  }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hero;
