import { Schema, model, Document, Types } from 'mongoose';

export interface IBusiness extends Document {
  owner: Types.ObjectId;      
  name: string;
  category: string;          
  address: string;
  location?: { lat: number; lng: number };
  openingHours: string;
  isVerified: boolean;
  avgRating: number;
}

const businessSchema = new Schema<IBusiness>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    address: { type: String, required: true },
    location: { lat: Number, lng: Number },
    openingHours: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    avgRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<IBusiness>('Business', businessSchema);