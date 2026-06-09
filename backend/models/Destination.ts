import mongoose, { Schema, Document } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  state: string;
  city: string;
  coverImage: string;
  description: string;
  bestSeason: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const DestinationSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    state: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    coverImage: { type: String, required: true },
    description: { type: String, required: true },
    bestSeason: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDestination>('Destination', DestinationSchema);
