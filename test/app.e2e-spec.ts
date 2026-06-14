import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@devtools.local';
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!';

describe('DevTools Hub (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.setGlobalPrefix('api', { exclude: ['health'] });
    await app.init();

    // seed admin (idempotent)
    await request(app.getHttpServer())
      .post('/api/auth/setup')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

    const loginRes = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    accessToken = loginRes.body.accessToken;
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  it('GET /health → 200', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });

  it('GET /api/links → 200 with array', () => {
    return request(app.getHttpServer())
      .get('/api/links')
      .expect(200)
      .expect((res) => expect(Array.isArray(res.body)).toBe(true));
  });

  it('POST /api/auth/login with wrong creds → 401', () => {
    return request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'wrong@wrong.com', password: 'wrongpassword' })
      .expect(401);
  });

  it('POST /api/auth/setup → 409 (admin already exists)', () => {
    return request(app.getHttpServer())
      .post('/api/auth/setup')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .expect(409);
  });

  it('GET /api/admin/links without token → 401', () => {
    return request(app.getHttpServer()).get('/api/admin/links').expect(401);
  });

  describe('Authenticated admin CRUD', () => {
    let linkId: string;

    it('POST /api/admin/links → creates link', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/admin/links')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Tool',
          url: 'https://test.example.com',
        })
        .expect(201);
      linkId = res.body.id;
      expect(linkId).toBeDefined();
    });

    it('GET /api/admin/links → includes created link', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/admin/links')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(res.body.some((l: any) => l.id === linkId)).toBe(true);
    });

    it('PUT /api/admin/links/:id → updates link', async () => {
      const res = await request(app.getHttpServer())
        .put(`/api/admin/links/${linkId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Updated Tool' })
        .expect(200);
      expect(res.body.title).toBe('Updated Tool');
    });

    it('DELETE /api/admin/links/:id → 204', () => {
      return request(app.getHttpServer())
        .delete(`/api/admin/links/${linkId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });
  });
});
