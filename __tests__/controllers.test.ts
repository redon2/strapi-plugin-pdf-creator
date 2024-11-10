import controllers from '../server/src/controllers/index'; // Import the controllers object
import services from '../server/src/services/index'; // Import the real services

describe('Controller', () => {
  let strapi: any;
  let ctx: any;

  beforeEach(async function () {
    // Setup the actual `strapi` object with the real services
    strapi = {
      plugin: jest.fn().mockReturnValue({
        service: jest.fn().mockReturnValue({
          getWelcomeMessage: services.service({ strapi }).getWelcomeMessage, // Use the actual service function
        }),
      }),
      config: {
        get: jest.fn().mockReturnValue({
          setting1: false,
        }),
      },
      contentTypes: {
        'api::article.article': {
          globalId: 'abc123',
        },
      },
    };

    // Create the mock context object
    ctx = {
      request: {
        body: {},
      }, // Initialize ctx.body as null to check it later
      body: null, // Ensure we are testing this value
    };
  });

  describe('Get Welcome msg', () => {
    it('should return the welcome message', async function () {
      const controller = controllers.controller({ strapi });
      await controller.index(ctx);
      expect(ctx.body).toBe('Welcome to Strapi 🚀');
    });
  });

  describe('Get settings', () => {
    it('should return the settings', async function () {
      const controller = controllers.controller({ strapi });
      await controller.settings(ctx);
      // Ensure the settings body is serialized as a string
      expect(ctx.body).toEqual({ setting1: false });
    });
  });
  describe('Get content types', () => {
    it('should return the content Types', async function () {
      const controller = controllers.controller({ strapi });
      await controller.contentTypes(ctx);
      // Ensure the settings body is serialized as a string
      expect(ctx.body).toEqual([{"globalId": "abc123", "name": "api::article.article"}]);
    });
  });
});
