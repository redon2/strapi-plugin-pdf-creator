import type { Core } from '@strapi/strapi';
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

async function createPageFromTemplate(templateBytes, data, templateName, flattenDocument, isTest) {
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  if (templateName !== '') {
    pdfDoc.setTitle(templateName);
  }

  const errors = [];
  const getFieldValue = (name) => data[name] || null;

  for (const field of fields) {
    const type = field.constructor.name;
    const name = field.getName();

    switch (type) {
      case 'PDFTextField':
        const text = getFieldValue(name);
        if (text) {
          form.getTextField(name).setText(text || '');
        }
        break;

      case 'PDFButton':
        const button = form.getButton(name);
        const buttonData = getFieldValue(name);
        if (buttonData?.url) {
          const imageUrl = isTest ? buttonData.url : `public${buttonData.url}`;
          const imageBytes = fs.readFileSync(imageUrl);
          const image = await pdfDoc.embedPng(imageBytes);
          button.setImage(image);
        }
        break;

      case 'PDFCheckBox':
        const isChecked = getFieldValue(name);
        const checkBox = form.getCheckBox(name);
        if (isChecked) {
          checkBox.check();
          checkBox.defaultUpdateAppearances();
        }
        break;

      case 'PDFDropdown':
        const dropdownValue = getFieldValue(name);
        if (dropdownValue) {
          const dropdown = form.getDropdown(name);
          dropdown.select(dropdownValue);
        }
        break;

      case 'PDFOptionList':
        const listValue = getFieldValue(name);
        if (listValue) {
          const optionList = form.getOptionList(name);
          const options = optionList.getOptions();
          if (options.some((item) => item === listValue)) {
            optionList.select(listValue);
          } else {
            errors.push(`Invalid value ${listValue} for ${name}`);
          }
        }
        break;

      case 'PDFRadioGroup':
        const radioValue = getFieldValue(name);
        if (radioValue) {
          const radioGroup = form.getRadioGroup(name);
          const options = radioGroup.getOptions();
          const isValidOption = options.some((item) => item === String(radioValue));

          if (isValidOption) {
            radioGroup.select(radioValue);
          } else {
            errors.push(`Invalid value ${radioValue} for ${name}`);
          }
        }
        break;
    }
  }

  // If there are errors, display them on the PDF
  if (errors.length > 0) {
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    firstPage.drawText(`There are errors with the data: ${errors.join(', ')}`, {
      x: 5,
      y: height - 20,
      size: 15,
      color: rgb(0.95, 0.1, 0.1),
    });
  }
  if (flattenDocument) form.flatten();
  return await pdfDoc.save();
}

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  getWelcomeMessage() {
    return 'Welcome to Strapi 🚀';
  },
  async createPDF(
    templateBytes: any,
    data: any,
    templateName: string,
    flattenDocument: boolean,
    isTest?: boolean
  ): Promise<Uint8Array> {
    const pdf = await createPageFromTemplate(
      templateBytes,
      data,
      templateName,
      flattenDocument,
      isTest
    );
    return pdf;
  },
});

export default service;
