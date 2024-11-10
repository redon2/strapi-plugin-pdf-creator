import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../pluginId';

const pdfGenerator = ({ strapi }: { strapi: Core.Strapi }) => ({
  async create(ctx) {
    const reqData = ctx.request.body?.data;

    if (!reqData || !reqData.templateId || !reqData.documentId || !reqData.collectionType) {
      ctx.throw(400, 'Missing required parameters: templateId, documentId, or collectionType');
    }

    const template = await strapi.documents(`plugin::${PLUGIN_ID}.template`).findOne({
      documentId: reqData.templateId,
      populate: ['file'],
    });

    if (!template) {
      ctx.throw(404, `Template with ID ${reqData.templateId} not found`);
    }

    let docData;
    try{
      docData = await strapi.documents(reqData.collectionType).findFirst({
        filters: { documentId: reqData.documentId },
        populate: '*'
      });
    }catch(error){
      ctx.throw(400, `${reqData.collectionType} not found`);
    }
   
    if (!docData) {
      ctx.throw(
        404,
        `Document with ID ${reqData.documentId} not found in collection ${reqData.collectionType}`
      );
    }
    const genDoc = await strapi
      .plugin(PLUGIN_ID)
      .service('service')
      .createPDF(template.file.url, docData, template.name);

    ctx.res
      .writeHead(200, {
        'Content-Length': Buffer.byteLength(genDoc),
        'Content-Type': 'application/pdf',
        'Content-disposition': `attachment; filename=Invoice${ctx.params.id}.pdf`,
      })
      .end(genDoc);
  },
});

export default pdfGenerator;
