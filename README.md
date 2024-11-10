<h1 align="center">
  Strapi PDF Creator Plugin
</h1>

Simple PDF generator based on a template and content.

## ⚠️ Compatibility with Strapi versions
This plugin was developed for the 5.X Strapi version. It has not been tested with the 4.X version. Use it at your own risk. 

## ⚙️ Installation

To install the Strapi PDF Creator Plugin, simply run one of the following command:

```
npm install @redon2inc/strapi-plugin-pdf-creator
```

```
yarn add @redon2inc/strapi-plugin-pdf-creator
```

## Functionality:
- Generate buttons only appears on edit views.
- Components single types and plugin content are not supported.
- Functionality only works for the Super Admin role
- Documents are flattened once generated. 

## Config
add the following to your `config/plugin.ts`

```javascript
{
  'strapi-plugin-pdf-creator': {
    enabled: true,
    config: {
      permissions: 'none' // coming soon
    }
  },
}
```

## Template requirements
- The PDF template's form field names must match the names as the collection type. Only matching names will be used to populate the pdf.
- TextFields use Text type fields.
- Buttons will be replaced with Media type fields. *Only when PDFs are flattened.*
- Checkboxes use Boolean type fields.
- RadioGroups, OptionLists, Dropdowns fields use Enumeration type fields.


## TODO:
- Security: Allow other roles to generate documents
- Add option to not flatten documents
- Beautify date fields.
- Settings function to validate template against schema.

## 👍 Contribute

1. Add a [GitHub Star](https://github.com/redon2/strapi-plugin-pdf-creator/stargazers) to the project.

## 🧾 License

This plugin is licensed under the MIT License.