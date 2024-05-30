import { INestApplication } from '@nestjs/common';
import { getAppAndClearDb } from '../utils/functions/get-app';
import {
  blog01Name,
  blog02Name,
  blogDescription,
  blogWebsite,
  bloggerBlogsURI,
} from '../utils/constants/blogs.constants';
import {
  saUsersURI,
  user01Email,
  user01Login,
  user02Email,
  user02Login,
  userPassword,
} from '../utils/constants/users.constants';
import {
  basicAuthLogin,
  basicAuthPassword,
  publicLoginUri,
} from '../utils/constants/auth.constants';
import passport from 'passport';
import { emailField } from '../../src/infrastucture/exception-filters/exception.constants';
import { randomUUID } from 'crypto';
import exp from 'constants';
import { createdBlogObject } from '../utils/objects/blogs.objects';

describe('Blogger blogs testing', () => {
  let app: INestApplication;
  let agent;
  beforeAll(async () => {
    const data = await getAppAndClearDb();
    app = data.app;
    agent = data.agent;
  });

  let user01Id;
  let user02Id;
  let aTokenUser01;
  let aTokenUser02;

  let blog01Id;
  let blog02Id;

  describe('Users creation and authentication', () => {
    it('Should create two users', async () => {
      const user01 = await agent
        .post(saUsersURI)
        .auth(basicAuthLogin, basicAuthPassword)
        .send({
          login: user01Login,
          password: userPassword,
          email: user01Email,
        })
        .expect(201);
      user01Id = user01.body.id;

      const user02 = await agent
        .post(saUsersURI)
        .auth(basicAuthLogin, basicAuthPassword)
        .send({
          login: user02Login,
          password: userPassword,
          email: user02Email,
        })
        .expect(201);
      user02Id = user02.body.id;
    });
    it('should login user 01', async () => {
      const response = await agent
        .post(publicLoginUri)
        .send({
          loginOrEmail: user01Login,
          password: userPassword,
        })
        .expect(200);

      aTokenUser01 = response.body.accessToken;
      return response;
    });
    it('should login user 02', async () => {
      const response = await agent
        .post(publicLoginUri)
        .send({
          loginOrEmail: user02Login,
          password: userPassword,
        })
        .expect(200);

      aTokenUser02 = response.body.accessToken;
      return response;
    });
  });

  describe('blogs create operations', () => {
    //401
    it('should return 401 when user try to create blog, when dont login', async () => {
      return agent
        .post(bloggerBlogsURI)
        .auth(randomUUID(), { type: 'bearer' })
        .expect(401);
    });
    //success
    it('should create blog for blogger 1', async () => {
      const response = await agent
        .post(bloggerBlogsURI)
        .auth(aTokenUser01, { type: 'bearer' })
        .send({
          name: blog01Name,
          description: blogDescription,
          websiteUrl: blogWebsite,
          userId: user01Id,
        })
        .expect(201);
      blog01Id = response.body.id;

      expect(response.body).toEqual(createdBlogObject);
      createdBlogObject;
      return response;
    });
    it('should create blog for blogger 2', async () => {
      const response = await agent
        .post(bloggerBlogsURI)
        .auth(aTokenUser02, { type: 'bearer' })
        .send({
          name: blog02Name,
          description: blogDescription,
          websiteUrl: blogWebsite,
          userId: user02Id,
        })
        .expect(201);
      blog02Id = response.body.id;

      expect(response.body).toEqual(createdBlogObject);
      createdBlogObject;
      return response;
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
