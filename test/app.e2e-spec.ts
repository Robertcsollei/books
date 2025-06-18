import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.cleanDb();
  });

  afterAll(async () => {
    await prisma.cleanDb();
    await app.close();
  });

  describe('Auth', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    describe('POST /auth/signup', () => {
      it('should create a new user', () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(testUser)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('access_token');
            expect(res.body.access_token).toBeDefined();
            expect(res.body).not.toHaveProperty('password');
          });
      });

      it('should not create user with existing email', async () => {
        // First signup
        await request(app.getHttpServer()).post('/auth/signup').send(testUser).expect(201);

        // Try to signup again with same email
        await request(app.getHttpServer()).post('/auth/signup').send(testUser).expect(409);
      });

      it('should validate required fields', async () => {
        await request(app.getHttpServer()).post('/auth/signup').send({ email: 'invalid-email' }).expect(400);
      });
    });

    describe('POST /auth/login', () => {
      beforeEach(async () => {
        // Create a user for login tests
        await request(app.getHttpServer()).post('/auth/signup').send(testUser);
      });

      it('should login with valid credentials', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password,
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('access_token');
            authToken = res.body.access_token;
          });
      });

      it('should not login with invalid password', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: testUser.email,
            password: 'wrongpassword',
          })
          .expect(401);
      });

      it('should not login with non-existent email', () => {
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: 'nonexistent@example.com',
            password: testUser.password,
          })
          .expect(401);
      });
    });
  });

  describe('User', () => {
    beforeEach(async () => {
      // Create a user and get auth token
      const testUser = {
        email: 'user@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      await request(app.getHttpServer()).post('/auth/signup').send(testUser);

      const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      authToken = loginResponse.body.access_token;
    });

    describe('GET /user/me', () => {
      it('should get current user profile', () => {
        return request(app.getHttpServer())
          .get('/user/me')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('sub');
            expect(res.body).toHaveProperty('email');
            expect(res.body.email).toBe('user@example.com');
            expect(res.body).not.toHaveProperty('password');
          });
      });

      it('should require authentication', () => {
        return request(app.getHttpServer()).get('/user/me').expect(401);
      });
    });

    describe('PATCH /user/me', () => {
      it('should update user profile', () => {
        return request(app.getHttpServer())
          .patch('/user/me')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            firstName: 'Updated',
            lastName: 'Name',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.firstName).toBe('Updated');
            expect(res.body.lastName).toBe('Name');
            expect(res.body).not.toHaveProperty('password');
          });
      });

      it('should require authentication', () => {
        return request(app.getHttpServer()).patch('/user/me').send({ firstName: 'Test' }).expect(401);
      });
    });
  });

  describe('Bookmarks', () => {
    beforeEach(async () => {
      // Create a user and get auth token
      const testUser = {
        email: 'bookmark@example.com',
        password: 'password123',
        firstName: 'Bookmark',
        lastName: 'User',
      };

      await request(app.getHttpServer()).post('/auth/signup').send(testUser);

      const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      authToken = loginResponse.body.access_token;
    });

    describe('GET /bookmarks', () => {
      beforeEach(async () => {
        // Create some test bookmarks
        const bookmarkData = [
          { title: 'Bookmark 1', url: 'https://example1.com', description: 'First bookmark' },
          { title: 'Bookmark 2', url: 'https://example2.com', description: 'Second bookmark' },
          { title: 'Bookmark 3', url: 'https://example3.com', description: 'Third bookmark' },
        ];

        for (const bookmark of bookmarkData) {
          await request(app.getHttpServer())
            .post('/bookmarks')
            .set('Authorization', `Bearer ${authToken}`)
            .send(bookmark);
        }
      });

      it('should get bookmarks with pagination', () => {
        return request(app.getHttpServer())
          .get('/bookmarks?page=1&limit=2')
          .expect(200)
          .expect((res) => {
            expect(res.body).toHaveProperty('data');
            expect(res.body).toHaveProperty('meta');
            expect(res.body.data).toHaveLength(2);
            expect(res.body.meta.page).toBe(1);
            expect(res.body.meta.limit).toBe(2);
            expect(res.body.meta.total).toBe(3);
            expect(res.body.meta.hasNext).toBe(true);
            expect(res.body.meta.hasPrev).toBe(false);
          });
      });

      it('should get second page', () => {
        return request(app.getHttpServer())
          .get('/bookmarks?page=2&limit=2')
          .expect(200)
          .expect((res) => {
            expect(res.body.data).toHaveLength(1);
            expect(res.body.meta.page).toBe(2);
            expect(res.body.meta.hasNext).toBe(false);
            expect(res.body.meta.hasPrev).toBe(true);
          });
      });

      it('should use default pagination', () => {
        return request(app.getHttpServer())
          .get('/bookmarks')
          .expect(200)
          .expect((res) => {
            expect(res.body.meta.page).toBe(1);
            expect(res.body.meta.limit).toBe(10);
          });
      });
    });

    describe('POST /bookmarks', () => {
      it('should create a new bookmark', () => {
        const bookmarkData = {
          title: 'Test Bookmark',
          url: 'https://example.com',
          description: 'A test bookmark',
        };

        return request(app.getHttpServer())
          .post('/bookmarks')
          .set('Authorization', `Bearer ${authToken}`)
          .send(bookmarkData)
          .expect(201)
          .expect((res) => {
            expect(res.body.title).toBe(bookmarkData.title);
            expect(res.body.url).toBe(bookmarkData.url);
            expect(res.body.description).toBe(bookmarkData.description);
          });
      });

      it('should require authentication', () => {
        return request(app.getHttpServer())
          .post('/bookmarks')
          .send({ title: 'Test', url: 'https://example.com' })
          .expect(401);
      });

      it('should validate required fields', () => {
        return request(app.getHttpServer())
          .post('/bookmarks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ title: 'Test' }) // Missing url
          .expect(400);
      });
    });

    describe('PATCH /bookmarks/:id', () => {
      let bookmarkId: string;

      beforeEach(async () => {
        // Create a bookmark first
        const response = await request(app.getHttpServer())
          .post('/bookmarks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Original Title',
            url: 'https://original.com',
            description: 'Original description',
          });

        bookmarkId = response.body.id;
      });

      it('should update a bookmark', () => {
        return request(app.getHttpServer())
          .patch(`/bookmarks/${bookmarkId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'Updated Title',
            description: 'Updated description',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.title).toBe('Updated Title');
            expect(res.body.description).toBe('Updated description');
            expect(res.body.url).toBe('https://original.com'); // Should remain unchanged
          });
      });

      it('should require authentication', () => {
        return request(app.getHttpServer()).patch(`/bookmarks/${bookmarkId}`).send({ title: 'Updated' }).expect(401);
      });
    });

    describe('DELETE /bookmarks/:id', () => {
      let bookmarkId: string;

      beforeEach(async () => {
        // Create a bookmark first
        const response = await request(app.getHttpServer())
          .post('/bookmarks')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            title: 'To Delete',
            url: 'https://delete.com',
          });

        bookmarkId = response.body.id;
      });

      it('should delete a bookmark', () => {
        return request(app.getHttpServer())
          .delete(`/bookmarks/${bookmarkId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
      });

      it('should require authentication', () => {
        return request(app.getHttpServer()).delete(`/bookmarks/${bookmarkId}`).expect(401);
      });
    });
  });
});
