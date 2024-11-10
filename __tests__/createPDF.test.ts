import fs from 'fs';
import path from 'path';
import controllers from '../server/src/controllers/index';
import services from '../server/src/services/index';

describe('Controller', () => {
  let strapi: any;
  let ctx: any;

  beforeEach(async function () {
    ctx = {
      isTest: true,
      request: {
        body: {
          data: {
            templateId: '1',
            documentId: '1',
            collectionType: 'api::article.article',
          },
        },
      },
      params: {
        id: '123',
      },
      res: {
        writeHead: jest.fn(),
        end: jest.fn(),
      },
      throw: jest.fn(),
      body: null,
    };
  });

  describe('Test plugin with blank PDF', () => {
    it('should generate a PDF and send the response', async function () {
      const docUrl = '__tests__/pdfFiles/blank.pdf';
      const templateFilePath = path.resolve(docUrl);
      const mockTemplateBytes = fs.readFileSync(templateFilePath);
      strapi = {
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockReturnValue({
            createPDF: services.service({ strapi }).createPDF,
          }),
        }),
        documents: jest.fn().mockImplementation((collectionType: string) => ({
          findOne: jest.fn().mockResolvedValue({
            file: { url: '__tests__/pdfFiles/blank.pdf' },
            name: 'Fake Template',
          }),
          findFirst: jest.fn().mockResolvedValue({
            documentId: '1',
            data: 'Fake Document Data',
          }),
        })),
        db: {
          lifecycles: {
            subscribe: jest.fn(),
          },
        },
        contentTypes: {
          'api::article.article': {
            attributes: {
              title: {
                type: 'string',
              },
            },
          },
        },
      };
      const controller = controllers.pdfGenerator({ strapi });

      await controller.create(ctx);

      expect(ctx.res.writeHead).toHaveBeenCalledWith(200, {
        'Content-Length': expect.anything(),
        'Content-Type': 'application/pdf',
        'Content-disposition': 'attachment; filename=123.pdf',
      });
    });
  });
  describe('Test invalid params 1', () => {
    it('should generate a PDF and send the response', async function () {
      ctx.request.body.data={}; // override values      
      strapi = {
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockReturnValue({
            createPDF: services.service({ strapi }).createPDF,
          }),
        }),
        documents: jest.fn().mockImplementation((collectionType: string) => ({
          findOne: jest.fn().mockResolvedValue(false),
        })),
        db: {
          lifecycles: {
            subscribe: jest.fn(),
          },
        },
        contentTypes: {
          'api::article.article': {
            attributes: {
              title: {
                type: 'string',
              },
            },
          },
        },
      };
      const controller = controllers.pdfGenerator({ strapi });

      await controller.create(ctx);
      expect(ctx.throw).toHaveBeenCalledWith(400, expect.any(String)); // You can also check for a message if needed

    });
  });
  describe('Test invalid params 2', () => {
    it('should generate a PDF and send the response', async function () {
      strapi = {
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockReturnValue({
            createPDF: services.service({ strapi }).createPDF,
          }),
        }),
        documents: jest.fn().mockImplementation((collectionType: string) => ({
          findOne: jest.fn().mockResolvedValue(false),
        })),
        db: {
          lifecycles: {
            subscribe: jest.fn(),
          },
        },
        contentTypes: {
          'api::article.article': {
            attributes: {
              title: {
                type: 'string',
              },
            },
          },
        },
      };
      const controller = controllers.pdfGenerator({ strapi });

      await controller.create(ctx);
      expect(ctx.throw).toHaveBeenCalledWith(404, expect.any(String)); // You can also check for a message if needed

    });
  });
});
