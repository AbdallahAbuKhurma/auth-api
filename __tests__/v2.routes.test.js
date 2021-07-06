const supergoose = require('@code-fellows/supergoose');
const server = require('../src/server');
const request = supergoose(server.server);

require('dotenv').config();

describe('admin', () => {
  let token;
  let id;

  it('sign up', async () => {
    const response = await request.post('/signup').send({ username: 'admin', password: 'password', role: 'admin' });
    expect(response.status).toBe(201);
    token = response.body.token;

  });
  it('sign in', async () => {
    const response = await request.post('/signin').auth('admin', 'password');
    expect(response.status).toBe(200);
    token = response.body.token;
  });
  it('handles create model with a bearer token that has create permissions adds an item to the DB and returns an object with the added item', async () => {
    const response = await request.post('/api/v2/food').send({
      name: 'banana',
      calories: 150,
      type: 'fruit',
    }).set({ 'Authorization': `Bearer ${token}` });
    expect(response.status).toBe(201);
    expect(response.body.name).toBeDefined();
    expect(response.body.name).toBe('banana');
    expect(response.body.type).toEqual('FRUIT');
    id=response.body._id;
  });
  it('handles return model with a bearer token that has read permissions returns a list of :model items', async () => {
    const response = await request.get('/api/v2/food').set({ 'Authorization': `Bearer ${token}` });
    expect(response.status).toBe(200);
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].name).toBe('banana');
    expect(response.body[0].type).toEqual('FRUIT');
  });
  it('handles return with a bearer token that has read permissions returns a single item by ID', async () => {
    const response = await request.get(`/api/v2/food/${id}`).set({ 'Authorization': `Bearer ${token}` });
    expect(response.status).toBe(200);
    expect(response.body.name).toBeDefined();
    expect(response.body.name).toBe('banana');
    expect(response.body.type).toEqual('FRUIT');
    expect(response.body._id).toEqual(id);
  });
  it('handles update with a bearer token that has update permissions returns a single, updated item by ID', async () => {
    const response = await request.put(`/api/v2/food/${id}`).send({
      name: 'updated',
      calories: 150,
      type: 'vegetable',
    }).set({ 'Authorization': `Bearer ${token}` });
    expect(response.status).toBe(200);
    expect(response.body.name).toBeDefined();
    expect(response.body.name).toBe('updated');
    expect(response.body.type).toEqual('VEGETABLE');
    expect(response.body._id).toEqual(id);
  });
  it('handles delete with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found', async () => {
    const response = await request.delete(`/api/v2/food/${id}`).send({
      name: 'updated',
      calories: 150,
      type: 'vegetable',
    }).set({ 'Authorization': `Bearer ${token}` });
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('updated');
    expect(response.body.type).toEqual('VEGETABLE');
    expect(response.body._id).toEqual(id);
    const response1 = await request.get(`/api/v2/food/${id}`).set({ 'Authorization': `Bearer ${token}` });
    expect(response1.status).toBe(200);
    expect(response1.body).toBe(null);
  });

});