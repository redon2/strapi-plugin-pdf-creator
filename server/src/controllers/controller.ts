import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../pluginId';

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin(PLUGIN_ID)
      .service('service')
      .getWelcomeMessage();
  },
  settings(ctx) {
    const conf = strapi.config.get(`plugin::${PLUGIN_ID}`);
    ctx.body = conf;
  },
  contentTypes(ctx) {
    const contentTypes = strapi.contentTypes;

    const filtered = Object.keys(contentTypes)
      .filter((key) => key.includes('api::'))
      .map((key) => ({
        name: key,
        globalId: contentTypes[key].globalId,
      }));

    ctx.body = filtered;
  },
});

export default controller;
