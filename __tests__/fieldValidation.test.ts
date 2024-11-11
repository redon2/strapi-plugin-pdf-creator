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

  describe('Test plugin with Fields PDF', () => {
    it('should generate a PDF and send the response', async function () {
      const docUrl = '__tests__/pdfFiles/all_fields.pdf';
      const templateFilePath = path.resolve(docUrl);
      const mockTemplateBytes = fs.readFileSync(templateFilePath);
      strapi = {
        plugin: jest.fn().mockReturnValue({
          service: jest.fn().mockReturnValue({
            createPDF: services.service({ strapi }).createPDF,
            BufferIamgesOnData: services.images({ strapi }).BufferIamgesOnData,
          }),
        }),
        config: {
          get: jest.fn().mockReturnValue({
            beautifyDate: {
              fields: ['dateField'],
            },
          }),
        },
        documents: jest.fn().mockImplementation((collectionType: string) => ({
          findOne: jest.fn().mockResolvedValue({
            file: { url: docUrl },
            name: 'Fake Template',
          }),
          findFirst: jest.fn().mockResolvedValue({
            documentId: '1',
            data: 'Fake Document Data',
            name: 'FakeName',
            email: 'fake@email',
            check_box: true,
            icon: {
                url :'__tests__/pdfFiles/mario_emblem.png',
                // imageBytes: new Buffer('73 10 cd 83 2a e7 70 bb 4d 36 '),
                // imageBytes: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+L+U4T8ABu8CpCYJ1DQAAAAASUVORK5CYII=',
                mime: 'image/png'
            },
            list: 'list',
            combo: 'comboItem',
            Group10: 'select1'
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
});
