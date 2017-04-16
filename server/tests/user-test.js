import chai, { expect } from 'chai';
import mongoose from 'mongoose';
import request from 'supertest';

import app from '../index';
import User from '../models/user-model';

mongoose.Promise = global.Promise; // set native Promise lib

chai.config.includeStack = true; // turn on stack trace

describe('User endopoints', () => {
  after((done) => {
    try {
      if (mongoose.connection.db) {
        mongoose.connection.db.dropDatabase();
      }
      done();
    } catch (error) {
      done(error);
    }
  });

  it('should list ALL users on /user GET', (done) => {
    request(app)
      .get('/api/user')
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal('ok');
        expect(res.body).to.have.property('users');
        expect(res.body.users).to.be.instanceof(Array);
        done();
      })
      .catch(error => done(error));
  });
  it('should add a SINGLE user on /user POST', (done) => {
    request(app)
      .post('/api/user')
      .send({ email: 'test@test.test', password: '12345', firstName: 'Test', lastName: 'Testing' })
      .expect(200)
      .then((res) => {
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal('ok');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('User created');
        done();
      })
      .catch(error => done(error));
  });
  it('should list a SINGLE user on /user/:id GET', (done) => {
    User.findOne({}, (errorFindUser, user) => {
      if (errorFindUser) {
        done(errorFindUser);
      }
      request(app)
      .get(`/api/user/${user._id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .then((res) => {
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal('ok');
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.be.instanceof(Object);
        expect(res.body.user._id).to.be.equal(user._id.toString());
        done();
      })
      .catch(error => done(error));
    });
  });
  it('should update a SINGLE user on /user/:id PUT', (done) => {
    User.findOne({}, (errorFindUser, user) => {
      if (errorFindUser) {
        done(errorFindUser);
      }
      request(app)
      .put(`/api/user/${user._id}`)
      .send({ firstName: 'John', lastName: 'Doe' })
      .expect(200)
      .then((res) => {
        expect(res.body).to.have.property('status');
        expect(res.body.status).to.be.equal('ok');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.be.equal('User updated');
        done();
      })
      .catch(error => done(error));
    });
  });
});
