import { HttpCacheInterceptor } from './http-cache.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('HttpCacheInterceptor', () => {
  let interceptor: HttpCacheInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpCacheInterceptor],
    }).compile();

    interceptor = module.get<HttpCacheInterceptor>(HttpCacheInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should append no cache header for GET requests', async () => {
      // Arrange
      const responseMock = {
        set: jest.fn(),
      };
      const requestMock = { method: 'GET' };
      const contextMock = {
        switchToHttp: (): unknown => ({
          getRequest: (): unknown => requestMock,
          getResponse: (): unknown => responseMock,
        }),
      } as ExecutionContext;
      const callHandleMock = { handle: jest.fn() } as unknown as CallHandler;

      // Act
      interceptor.intercept(contextMock, callHandleMock);

      // Assert
      expect(responseMock.set).toHaveBeenNthCalledWith(
        1,
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
      );
      expect(responseMock.set).toHaveBeenCalledTimes(1);
      expect(callHandleMock.handle).toHaveBeenCalledTimes(1);
    });
    it("shouldn't append cache header for other than GET requests", async () => {
      // Arrange
      const methods = ['POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];
      const responseMock = {
        set: jest.fn(),
      };
      const requestMock = { method: '' };
      const contextMock = {
        switchToHttp: (): unknown => ({
          getRequest: (): unknown => requestMock,
          getResponse: (): unknown => responseMock,
        }),
      } as ExecutionContext;
      const callHandleMock = { handle: jest.fn() } as unknown as CallHandler;

      // Act and Assert
      for (const method of methods) {
        requestMock.method = method.toString();
        interceptor.intercept(contextMock, callHandleMock);
      }

      // Assert
      expect(responseMock.set).toHaveBeenCalledTimes(0);
      expect(responseMock.set).toHaveBeenCalledTimes(0);
      expect(callHandleMock.handle).toHaveBeenCalledTimes(methods.length);
    });
  });
});
