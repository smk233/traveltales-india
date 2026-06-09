import mongoose, { Schema, Document } from 'mongoose';

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
}

const BookmarkSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);

// Ensure a user can only bookmark a post once
BookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true });

export default mongoose.model<IBookmark>('Bookmark', BookmarkSchema);
