<h1 align="center">
  Strapi PDF Creator Plugin
</h1>

Simple PDF generator based on a template and content.

## ⚠️ Compatibility with Strapi versions
This plugin was developed for the 5.X Strapi version. It has not been tested with the 4.X version. Use it at your own risk. 

## ⚙️ Installation

To install the Strapi Advanced UUID Plugin, simply run one of the following command:

```
npm install @redon2inc/strapi-plugin-pdf-creator
```

```
yarn add @redon2inc/strapi-plugin-pdf-creator
```

# Functionality:
- Generate buttons only appears on edit views.
- Components single types and plugin content are not supported.
- Functionality only works for the Super Admin role
- Documents are flattened once generated. 

# Config
```

```

# Template requirements
- The PDF template's form field names must match the names as the collection type. Only matching names will be used to populate the pdf.
- TextFields use Text type fields.
- Buttons will be replaced with Media type fields. *Only when PDFs are flattened.*
- Checkboxes use Boolean type fields.
- RadioGroups, OptionLists, Dropdowns fields use Enumeration type fields.


# TODO:
Security -> create roles section
Option to flatten documents -> global
Option for other providers other than local
Create examples page
Beautify Dates
UI function to validate template