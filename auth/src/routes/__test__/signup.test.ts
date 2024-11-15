import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email:'arha@gmail.com',
            password: "arha"
        })
        .expect(201);
});

it('returns a 400 with invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email:'arhagmail.com',
            password: "arha"
        })
        .expect(400);
});

it('returns a 400 with invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email:'arhagmail.com',
            password: "ar"
        })
        .expect(400);
});

it('returns a 400 with missing email & password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            password: "arha"
        })
        .expect(400);
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "arha@gmail.com"
        })
        .expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email:'arha@gmail.com',
            password: "arha"
        })
        .expect(201);
    await request(app)
        .post('/api/users/signup')
        .send({
            email:'arha@gmail.com',
            password: "arha"
        })
        .expect(400);
});

it('disallows duplicate emails', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email:'arha@gmail.com',
            password: "arha"
        })
        .expect(201);
         
    expect(response.get('Set-Cookie')).toBeDefined();
});