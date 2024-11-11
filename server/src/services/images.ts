import type { Core } from '@strapi/strapi';
const fs = require('fs');

interface Image {
  mime: string;
  url: string;
}

const images = ({ strapi }: { strapi: Core.Strapi }) => ({
  BufferIamgesOnData(data: Record<string, any>, isTest: boolean) {
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object' && value !== null) {
        if ((value as Image).mime === 'image/png') {
          const url = `${isTest ? '' : 'public'}${(value as Image).url}`;
          const imageBytes = fs.readFileSync(url);
          data[key].imageBytes = imageBytes;
        }
      }
    }
    return data;
  },
});

export default images;
