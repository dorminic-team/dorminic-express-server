// __tests__/app.test.js

const request = require('supertest');
const app = require('../index'); // Import your Express app

describe('GET /test', () => {
  it('should return a success message', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Database connection successful!');
  });
});
