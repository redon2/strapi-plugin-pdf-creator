import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../pluginId';
const fs = require('fs');

const pdfGenerator = ({ strapi }: { strapi: Core.Strapi }) => ({
  async create(ctx) {
    const reqData = ctx.request.body?.data;

    if (!reqData || !reqData.templateId || !reqData.documentId || !reqData.collectionType) {
      ctx.throw(400, 'Missing required parameters: templateId, documentId, or collectionType');
      return;
    }

    const template = await strapi.documents(`plugin::${PLUGIN_ID}.template`).findOne({
      documentId: reqData.templateId,
      populate: ['file'],
    });

    if (!template) {
      ctx.throw(404, `Template with ID ${reqData.templateId} not found`);
      return;
    }

    let docData;
    try {
      docData = await strapi.documents(reqData.collectionType).findFirst({
        filters: { documentId: reqData.documentId },
        populate: '*',
      });
    } catch (error) {
      ctx.throw(400, `${reqData.collectionType} not found`);
      return;
    }

    if (!docData) {
      ctx.throw(
        404,
        `Document with ID ${reqData.documentId} not found in collection ${reqData.collectionType}`
      );
      return;
    }
    const templateBytes = fs.readFileSync(ctx.isTest ? template.file.url : `public${template.file.url}`);
    const genDoc = await strapi
      .plugin(PLUGIN_ID)
      .service('service')
      .createPDF(
        templateBytes,
        docData, 
        template.name, 
        template.flattenDocument, 
        ctx.isTest
      );

    ctx.res.writeHead(200, {
      'Content-Length': Buffer.byteLength(genDoc),
      'Content-Type': 'application/pdf',
      'Content-disposition': `attachment; filename=${ctx.params.id}.pdf`,
    });
    ctx.res.end(genDoc);
  },
});

export default pdfGenerator;
