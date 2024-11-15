import request from 'supertest';
import { app } from '../../app';

it('fails when a email that does not exist is supllied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: "arha@gmail.com",
            password: "arha"
        })
        .expect(400);
});

it('fals when incorrect password is supllied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "arha@gmail.com",
            password: "arha"
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: "arha@gmail.com",
            password: "ar"
        })
        .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "arha@gmail.com",
            password: "arha"
      })
      .expect(201);
  
    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: "arha@gmail.com",
            password: "arha"
        })
        .expect(200);
  
    expect(response.get('Set-Cookie')).toBeDefined();
  });

