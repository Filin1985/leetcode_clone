const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { User, Problem, Tag } = require('../models');

describe('Problem API', () => {
  let adminToken;
  let userToken;
  
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Create test users
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });
    
    const user = await User.create({
      username: 'user',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });
    
    // Login to get tokens
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'admin123' });
    
    const userLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'user123' });
    
    adminToken = adminLogin.body.token;
    userToken = userLogin.body.token;
    
    // Create test tags
    await Tag.bulkCreate([
      { name: 'arrays' },
      { name: 'strings' },
      { name: 'dynamic-programming' }
    ]);
  });
  
  afterAll(async () => {
    await sequelize.close();
  });
  
  describe('POST /problems', () => {
    it('should create a new problem as admin', async () => {
      const response = await request(app)
        .post('/api/problems')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Two Sum',
          description: 'Given an array of integers...',
          difficulty: 'easy',
          testCases: [
            { input: '[2,7,11,15]', output: '[0,1]' }
          ],
          constraints: '2 <= nums.length <= 10^4',
          examples: [
            { input: '[2,7,11,15]', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9' }
          ],
          tags: ['arrays']
        });
      
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Two Sum');
    });
    
    it('should forbid problem creation as regular user', async () => {
      const response = await request(app)
        .post('/api/problems')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Unauthorized Problem',
          description: 'This should fail...',
          difficulty: 'easy',
          testCases: [],
          constraints: '',
          examples: []
        });
      
      expect(response.statusCode).toBe(403);
    });
  });
  
  describe('GET /problems', () => {
    it('should get all problems', async () => {
      const response = await request(app)
        .get('/api/problems')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
    
    it('should filter problems by difficulty', async () => {
      const response = await request(app)
        .get('/api/problems?difficulty=easy')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.data.every(p => p.difficulty === 'easy')).toBeTruthy();
    });
  });
  
  describe('GET /problems/:id', () => {
    it('should get a problem by ID', async () => {
      // First create a problem
      const problem = await Problem.create({
        title: 'Test Problem',
        description: 'Test description',
        difficulty: 'medium',
        testCases: [],
        constraints: '',
        examples: []
      });
      
      const response = await request(app)
        .get(`/api/problems/${problem.id}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toBe(problem.id);
    });
    
    it('should return 404 for non-existent problem', async () => {
      const response = await request(app)
        .get('/api/problems/9999')
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.statusCode).toBe(404);
    });
  });
});