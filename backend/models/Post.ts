import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  images: string[];
  destination: mongoose.Types.ObjectId;
  state: string;
  city: string;
  author: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  tags: string[];
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    images: [{ type: String }],
    destination: { type: Schema.Types.ObjectId, ref: 'Destination', required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IPost>('Post', PostSchema);
