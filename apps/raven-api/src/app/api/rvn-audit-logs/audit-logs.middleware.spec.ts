import { Request } from 'express';

import { Test, TestingModule } from '@nestjs/testing';
import { HttpMethodEnum } from '../../shared/enum/http-method.enum';
import { AuthService } from '../rvn-auth/auth.service';
import { RavenLogger } from '../rvn-logger/raven.logger';
import { AuditLogsMiddleware } from './audit-logs.middleware';
import { AuditLogsService } from './audit-logs.service';

describe('AuditLogsMiddleware', () => {
  let middleware: AuditLogsMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogsMiddleware,
        {
          provide: AuditLogsService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            decodeToken: jest.fn(),
          },
        },
        {
          provide: RavenLogger,
          useValue: {
            setContext: jest.fn(),
          },
        },
      ],
    }).compile();

    middleware = module.get<AuditLogsMiddleware>(AuditLogsMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('verifyRequest', () => {
    it('should return true for supported HttpMethod', () => {
      const reqMock = {
        protocol: 'http',
        hostname: 'localhost',
        method: 'POST',
        headers: {},
        originalUrl: '/api/auth/login',
        body: {
          test: 'value',
        },
        get: jest.fn(),
      } as unknown as Request;

      const reqVerified = middleware.verifyRequest(reqMock);

      expect(reqVerified).toBe(true);
    });

    it('should return false for not supported HttpMethod', () => {
      const reqMock = {
        protocol: 'http',
        hostname: 'localhost',
        method: 'OPTIONS',
        headers: {},
        originalUrl: '/api/users',
        body: {},
        get: jest.fn(),
      } as unknown as Request;

      const reqVerified = middleware.verifyRequest(reqMock);

      expect(reqVerified).toBe(false);
    });
  });

  describe('parseRequest', () => {
    it('should return parsed data from request', () => {
      const reqMock = {
        protocol: 'http',
        hostname: 'localhost',
        method: 'GET',
        headers: {
          authorization: 'Bearer testToken',
        },
        originalUrl: '/api/test/action?search=test',
        body: {
          test: 'value',
        },
        get: jest.fn(),
      } as unknown as Request;

      const reqParsed = middleware.parseRequest(reqMock);

      expect(reqParsed.module).toBe('test');
      expect(reqParsed.query).toBe('search=test');
      expect(reqParsed.body).toEqual({ test: 'value' });
      expect(reqParsed.httpMethod).toBe(HttpMethodEnum.GET);
      expect(reqParsed.controller).toBe('api/test/action');
      expect(reqParsed.token).toBe('testToken');
    });

    it('should delete password from login request body', () => {
      const reqMock = {
        protocol: 'http',
        hostname: 'localhost',
        method: 'POST',
        headers: {},
        originalUrl: '/api/auth/login',
        body: {
          username: 'test@test.io',
          password: '***',
        },
        get: jest.fn(),
      } as unknown as Request;

      const reqParsed = middleware.parseRequest(reqMock);

      expect(reqParsed.body).toEqual({ username: 'test@test.io' });
    });
  });
});
