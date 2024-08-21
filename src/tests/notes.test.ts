import request from 'supertest';
import {app} from '../index'; // Your Express app

let authToken: string;
let noteId: string;

//fastOne
const registerAndLogin = async (username: string, password: string) => {
  await request(app).post('/auth/register').send({ username, password });
  const response = await request(app).post('/auth/login').send({ username, password });
  return response.body.token;
};

beforeAll(async () => {
  authToken = await registerAndLogin('notesTestGuy', 'testpassword');
});

describe('Notes API', () => {
  it('should create a note with valid data', async () => {
    const response = await request(app)
      .post('/notes')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Test Note', body: 'This is a test note' });

    noteId = response.body._id;

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('title', 'Test Note');
    expect(response.body).toHaveProperty('body', 'This is a test note');
    expect(response.body).toHaveProperty('sentiment');
  });

  it('should retrieve notes for the user', async () => {
    const response = await request(app)
      .get('/notes')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should retrieve a note by ID', async () => {
    const response = await request(app)
      .get(`/notes/${noteId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('title', 'Test Note');
    expect(response.body).toHaveProperty('body', 'This is a test note');
  });

  it('should fail to retrieve a note by invalid ID', async () => {
    const response = await request(app)
      .get('/notes/invalidid')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid ID');
  });

  it('should fail to retrieve a note by ID if not authorized', async () => {
    //create another note with a different user
    const otherUserToken = await registerAndLogin('kokomelon4', 'testpassword');
    const response = await request(app)
      .post('/notes')
      .set('Authorization', `Bearer ${otherUserToken}`)
      .send({ title: 'Another Note', body: 'This is another note' });

    const notedId = response.body._id;

    // Try to access the note with the original user token
    const accessResponse = await request(app)
      .get(`/notes/${notedId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(accessResponse.status).toBe(404);
    expect(accessResponse.body).toHaveProperty('message', 'Note not found');
  });

  it('should list users', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should subscribe to a user', async () => {
    //noteTestGuy registers to ilovenoteTestGuy
    const secondUserResponse = await request(app)
      .post('/auth/register')
      .send({ username: 'iLoveNoteTestGuy', password: 'testpassword' });
    
    const iLoveNoteTestGuyId = secondUserResponse.body._id;
  
    const response = await request(app)
      .post(`/subscribe/${iLoveNoteTestGuyId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', `Subscribed to iLoveNoteTestGuy`);
  });

  it('should fail to subscribe to a non-existent user', async () => {
    const response = await request(app)
      .post('/subscribe/invalidid')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found');
  });

  it('should fail to create a note without authentication', async () => {
    const response = await request(app)
      .post('/notes')
      .send({ title: 'Unauthorized Note', body: 'This note should not be created' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Not authorized, no token');
  });
});
