const { type } = require("os");

module.exports = {
  info: {
    tableName: 'template',
    singularName: 'template',
    pluralName: 'templates',
    displayName: 'PDF Templates',
    description: 'Templates used for PDF Template plugin',
    kind: 'collectionType',
  },
  options: {
    draftAndPublish: false,
  },
  pluginOptions: {
    'content-manager': {
      visible: true,
    },
    'content-type-builder': {
      visible: true,
    },
  },
  attributes: {
    name: {
      type: 'string',
      required: true,
      maxLength: 40,
    },
    collectionName: {
      type: 'string',
      required: true,
      maxLength: 40,
    },
    enabled: {
      type: 'boolean',
      required: true,
      default: false,
    },
    flattenDocument: {
      type: 'boolean',
      required: true,
      default: true,
    },
    file: {
      type: "media",
      multiple: false,
      required: true,
      allowedTypes: ["files"]
    },
  },
};