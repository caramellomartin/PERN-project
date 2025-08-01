import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    tags: [
      {
        name: 'Products',
        description: 'API operations related to products'
      }
    ],
    info: {
      title: 'Rest API Node.js / Express / TypeScript',
      version: "1.0.0",
      description: "API Docs for Products"
    }
  },
  apis: ['./src/routes/router.ts']
}

const swaggerSpec = swaggerJSDoc(options)

const swaggerUiOptions: SwaggerUiOptions = {
  customCss: `
      .topbar-wrapper .link {
        content: url('https://www.svgrepo.com/show/375469/os-inventory-management.svg');
        height: 80px;
        width: auto;
      }
  `,
  customSiteTitle: 'Documentación REST API Express - TypeScript'
}

export default swaggerSpec
export { swaggerUiOptions }