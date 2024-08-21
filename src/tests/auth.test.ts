import request from 'supertest';
import {app} from '../index'; 

let authToken: string;

beforeAll(async () => {
  await request(app)
    .post('/auth/register')
    .send({ username: 'testerGuy', password: 'testpassword' });
});

describe('User Authentication', () => {
  it('should log in and get a token', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testerGuy', password: 'testpassword' });

    authToken = response.body.token;

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should retrieve user profile with token', async () => {
    const response = await request(app)
      .get('/auth/profile')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testerGuy');
  });

   it('should fail to log in with incorrect password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'testerGuy', password: 'wrongpassword' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should fail to log in with non-existent user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'nonexistentuser', password: 'somepassword' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should fail to retrieve user profile with an invalid token', async () => {
    const response = await request(app)
      .get('/auth/profile')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Not authorized, token failed');
  });

  it('should fail to retrieve user profile without a token', async () => {
    const response = await request(app)
      .get('/auth/profile');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Not authorized, no token');
  });

  it('should fail to register with missing password', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'iDontWantPassword' }); 
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Username and password are required');
  });

  it('should fail to register with an already existing username', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'testerGuy', password: 'testpassword' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'User already exists');
  });

  it('should fail to register with missing username', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ password: 'userLame' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Username and password are required');
  });
});
