jest.mock('nestjs-request-context', () => ({
  RequestContext: {
    currentContext: {
      req: {
        user: {
          id: 'test-user-id',
        },
      },
    },
  },
}));
