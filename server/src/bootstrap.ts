import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from './pluginId';

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  // bootstrap phase
  await registerPermissionActions();
};
const registerPermissionActions = async () => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Generate PDF from templates',
      uid: 'generate',
      pluginName: PLUGIN_ID,
    },
    {
      section: 'plugins',
      displayName: 'Manage plugin Settings',
      uid: 'admin',
      pluginName: PLUGIN_ID,
    }
  ];

  await strapi.service('admin::permission').actionProvider.registerMany(actions);
};

export default bootstrap;
