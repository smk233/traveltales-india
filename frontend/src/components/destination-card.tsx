import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';
import { Destination } from '../types';

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  return (
    <Link
      to={`/destination/${destination._id}`}
      className="group relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 block"
    >
      <img
        src={destination.coverImage}
        alt={destination.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity" />

      <div className="absolute bottom-0 inset-x-0 p-5 text-white flex flex-col justify-end h-1/2">
        <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-brand-100 mb-1.5">
          <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
          {destination.city}, {destination.state}
        </div>
        <h3 className="text-xl font-bold mb-1 group-hover:text-brand-500 transition-colors">
          {destination.name}
        </h3>
        <p className="text-xs text-gray-300 line-clamp-2 font-light leading-relaxed mb-3">
          {destination.description}
        </p>

        <div className="text-[10px] text-brand-50 font-semibold border-t border-white/10 pt-2 flex items-center gap-1.5">
          <Calendar className="w-3 h-3" /> Best Season: {destination.bestSeason}
        </div>
      </div>
    </Link>
  );
};
export default DestinationCard;
