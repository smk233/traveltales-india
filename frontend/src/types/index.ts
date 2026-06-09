export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  followers: string[];
  following: string[];
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface Destination {
  _id: string;
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

export interface Comment {
  _id: string;
  postId: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
    role: 'user' | 'admin';
  };
  text: string;
  createdAt: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  images: string[];
  destination: Destination;
  state: string;
  city: string;
  author: User;
  likes: string[];
  comments: Comment[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
