'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../src/server');
const request = supergoose(server.server);

require('dotenv').config();

describe('unauthenticated Api routes', () => {
  let id;
  it('handles adding an item to the Database and returns an object with the added items', async () => {
    const response = await request.post('/api/v1/food').send({
      name:'apple',
      calories:150,
      type:'fruit',
    });
    id = response.body._id;
    expect(response.status).toBe(201);
    expect(response.body.name).toBeDefined();
    expect(response.body.name).toBe('apple');
    expect(response.body.type).toEqual('FRUIT');
  });
  it('handles returning a list of the model items', async () => {
    const response = await request.get('/api/v1/food');
    expect(response.status).toBe(200);
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].name).toBe('apple');
    expect(response.body[0].type).toEqual('FRUIT');
  });
  it('handles returning a single item by id', async () => {
    const response = await request.get(`/api/v1/food/${id}`);
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(id);
    expect(response.body.name).toBe('apple');
    expect(response.body.type).toEqual('FRUIT');
  });
  it('handles returning an item and update it', async () => {
    const response = await request.put(`/api/v1/food/${id}`).send({
      name:'updated',
      calories:120,
      type:'vegetable',
    });
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(id);
    expect(response.body.name).toBe('updated');
    expect(response.body.type).toEqual('VEGETABLE');
  });
  it('handles require an item by its id and delete it', async () => {
    const response = await request.delete(`/api/v1/food/${id}`).send({
      name:'any',
      calories: 120,
      type: 'any',
    });
    expect(response.status).toBe(200);
    expect(response.body._id).toBe(id);
    expect(response.body.name).toBe('updated');
    expect(response.body.type).toEqual('VEGETABLE');
    const response1 = await request.get(`/api/v1/food/${id}`);
    expect(response1.status).toBe(200);
    expect(response1.body).toBe(null);
  });
  

});