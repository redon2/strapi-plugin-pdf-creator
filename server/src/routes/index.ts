import { PLUGIN_ID } from "../pluginId";
export default [
  {
    method: 'GET',
    path: '/',
    handler: 'controller.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/settings',
    handler: 'controller.settings',
    config: {
      policies: [`plugin::${PLUGIN_ID}.isAdmin`]
    },
  },
  {
    method: 'GET',
    path: '/content-type',
    handler: 'controller.contentTypes',
    config: {
      policies: [`plugin::${PLUGIN_ID}.isAdmin`]
    },
  },
  {
    method: 'POST',
    path: '/create-pdf',
    handler: 'pdfGenerator.create',
    config: {
      policies: [`plugin::${PLUGIN_ID}.isAdmin`]
    },
  },

];
