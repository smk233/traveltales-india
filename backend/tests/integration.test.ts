/// <reference types="jest" />
import request from 'supertest';
import app from '../app';
import { connectDB, disconnectDB } from '../config/db';

describe('TravelTales India REST API Integration Suite', () => {
  let userToken: string;
  let adminToken: string;
  let testDestinationId: string;
  let testPostId: string;
  let testPostSlug: string;
  let testCommentId: string;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('Auth Controller Endpoints', () => {
    it('should register an admin user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Super Admin',
          email: 'admin@tales.in',
          password: 'adminpassword123',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.role).toBe('admin');
    });

    it('should login admin and save their token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@tales.in',
          password: 'adminpassword123',
        });

      expect(res.status).toBe(200);
      const cookies = res.headers['set-cookie'] as unknown as string[];
      adminToken = cookies.find((c) => c.includes('token='))!.split(';')[0];
    });

    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Regular Explorer',
          email: 'explorer@tales.in',
          password: 'password123',
          bio: 'A simple explorer logs.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('explorer@tales.in');
      expect(res.body.data.role).toBe('user');
    });

    it('should login user and return a JWT cookie', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'explorer@tales.in',
          password: 'password123',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.headers['set-cookie']).toBeDefined();

      const cookies = res.headers['set-cookie'] as unknown as string[];
      const tokenCookie = cookies.find((c) => c.includes('token='));
      expect(tokenCookie).toBeDefined();
      userToken = tokenCookie!.split(';')[0];
    });

    it('should fetch the current user details via /auth/me', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [userToken]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Regular Explorer');
    });
  });

  describe('Destination Controller Endpoints', () => {
    it('should reject non-admin adding a destination', async () => {
      const res = await request(app)
        .post('/api/destinations')
        .set('Cookie', [userToken])
        .send({
          name: 'Alleppey Houseboats',
          state: 'Kerala',
          city: 'Alleppey',
          coverImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2',
          description: 'Beautiful backwaters of Kerala',
          bestSeason: 'October to March',
        });

      expect(res.status).toBe(403);
    });

    it('should allow admin to add a destination', async () => {
      const res = await request(app)
        .post('/api/destinations')
        .set('Cookie', [adminToken])
        .send({
          name: 'Alleppey Houseboats',
          state: 'Kerala',
          city: 'Alleppey',
          coverImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2',
          description: 'Beautiful backwaters of Kerala',
          bestSeason: 'October to March',
          coordinates: { lat: 9.4981, lng: 76.3388 },
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBeDefined();
      testDestinationId = res.body.data._id;
    });

    it('should retrieve all destinations', async () => {
      const res = await request(app).get('/api/destinations');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('Posts Controller Endpoints', () => {
    it('should create a new travel tale (post) successfully', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Cookie', [userToken])
        .send({
          title: '3 Days in Alleppey Backwaters',
          description: 'A complete travel log with budget houseboat details',
          content: 'Alleppey backwaters are majestic. We rented a boat for 15k INR...',
          destinationId: testDestinationId,
          tags: ['houseboat', 'kerala', 'backwaters'],
          images: ['https://images.unsplash.com/photo-1593693397690-362cb9666fc2'],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBeDefined();
      testPostId = res.body.data._id;
      testPostSlug = res.body.data.slug;
    });

    it('should return posts list', async () => {
      const res = await request(app).get('/api/posts');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('should fetch single post by slug', async () => {
      const res = await request(app).get(`/api/posts/slug/${testPostSlug}`);
      expect(res.status).toBe(200);
      expect(res.body.data._id).toBe(testPostId);
    });

    it('should allow user to like the post', async () => {
      const res = await request(app)
        .post(`/api/posts/${testPostId}/like`)
        .set('Cookie', [userToken]);

      expect(res.status).toBe(200);
      expect(res.body.data.liked).toBe(true);
      expect(res.body.data.likesCount).toBe(1);
    });
  });

  describe('Comments Controller Endpoints', () => {
    it('should add a comment to the post', async () => {
      const res = await request(app)
        .post('/api/comments')
        .set('Cookie', [userToken])
        .send({
          postId: testPostId,
          text: 'This is a stellar log! Thanks for the budget tips.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.text).toBe('This is a stellar log! Thanks for the budget tips.');
      testCommentId = res.body.data._id;
    });

    it('should allow a user to delete their own comment', async () => {
      const res = await request(app)
        .delete(`/api/comments/${testCommentId}`)
        .set('Cookie', [userToken]);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
